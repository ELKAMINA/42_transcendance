import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import axios from 'axios';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageBody } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ValidationError } from 'class-validator';
import { WsException } from '@nestjs/websockets';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  Res,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';
import { UserUpdatesDto } from 'src/user/dto/user.dto';

@WebSocketGateway(4003, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@Injectable()
export class ProfileGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //OnGatewayConnection : means that we want it to run when anyone connects to the server
  @WebSocketServer() io: Namespace;

  private users: Map<object, Array<Socket>> = new Map<object, Array<Socket>>();

  constructor(
    private userServ: UserService,
    private prisma: PrismaService,
    private home: HomeService,
    private auth: AuthService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private logger: Logger = new Logger('ProfileGateway');

  afterInit(server: Server) {
    this.logger.log('Gateway Initialized');
    // server.use((socket: Socket, next: (err?: ExtendedError) => void) =>
    //   MyMiddleware.prototype.use(socket, next),
    // );
    // console.log('Serveeer', server);
  } // For logging message in the console (what is in yellow and green is the logger)

  //Whenever we want to handle message in the server, We use this decorator to handle it. MsgToServer is the name of the event he is waiting for
  async handleConnection(
    @ConnectedSocket() client: Socket,
    @Res() response: Response,
    ...args: Socket[]
  ) {
    let user;
    try {
      // const sockets = this.io.sockets; // toutes les sockets connectées
      // console.log('test ', this.server)
      // console.log('client ', client);
      // console.log('al reponse ', response);
      if (client.handshake.headers.cookie) {
        user = await this.userServ.searchUser(
          this.getUserInfoFromSocket(client.handshake.headers.cookie).nickname,
        );
      }
      if (user) {
        this.io.to(client.id).emit('newUserConnected', user.faEnabled);
      }
      this.logger.log(`WS Client with id: ${client.id}  connected!`);
      // this.logger.debug(`Number of connected sockets ${sockets.size}`);
      this.logger.log(`Client connected: ${client.id}`);
      // this.verifyJwtSocketConnections(client, response);
    } catch (e) {
      console.log('Socket connection not established');
    } // console.log('users connected ', this.users);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      // const sockets = this.io.sockets;
      // this.users.delete(client);

      this.logger.log(`WS Client with id: ${client.id}  disconnected!`);
      // this.logger.debug(`Number of connected sockets ${sockets.size}`);
    } catch (e) {
      console.log('ON CONNECTION ERROR', e);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('ERROR', new UnauthorizedException());
    socket.disconnect();
  }

  @UsePipes(
    new ValidationPipe({
      exceptionFactory(validationErrors: ValidationError[] = []) {
        const errors = validationErrors;
        return new WsException(errors);
      },
    }),
  )
  @SubscribeMessage('changeProfile')
  async changeProfile(
    @ConnectedSocket() socket: Socket,
    @MessageBody() updates: UserUpdatesDto,
  ) {
    try {
      /** ISSUE 118 ***/
      // GET THE USER PROFILE
      // console.log('userUpdates ', updates);
      const currentUser = await this.userServ.searchUser(updates.oldNick);
      if (!currentUser) {
        console.error('user not found!');
        return;
      }
      // console.log("[Home - GATEWAY]", "currentUser: ", currentUser, "currentUser.status: ", currentUser.status);
      // CHECK THE STATUS OF THE USER THEN THROW AN ERROR IF IS PLAYING
      if (currentUser.status === 'Playing') {
        this.io.to(socket.id).emit('ErrorChangeProfileOnPlaying');
        throw new ForbiddenException(
          'Impossible to change settings when an user is playing',
        );
      }
      const newInfos = await this.userServ.updateUserInfo(updates);
      this.io.to(socket.id).emit('UpdateInfoUser', newInfos);
    } catch (e) {
      console.log('error ');
      return e;
    }
  }

  getUserInfoFromSocket(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }

  async verifyJwtSocketConnections(client: Socket) {
    let newTokens;
    let userInfo;
    // console.log('Coookie ', client.handshake.headers.cookie);
    if (client.handshake.headers.cookie) {
      userInfo = this.getUserInfoFromSocket(client.handshake.headers.cookie);
    }
    try {
      await this.jwt.verifyAsync(userInfo.accessToken, {
        secret: this.config.get('ACCESS_TOKEN'),
      });
      this.createUser(userInfo, client);
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        try {
          newTokens = await this.auth.refresh(
            userInfo.nickname,
            userInfo.refreshToken,
          );
          const data: object = {
            nickname: userInfo.nickname,
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
          };
          axios
            .post('http://127.0.0.1:4001/auth/update-cookie', data)
            .then((res) => {
              //   console.log('response ', res);
            })
            .catch((e) => console.error('erooor ', e));
          return newTokens;
        } catch (e) {
          throw new ForbiddenException('Invalid access and refresh tokens');
        }
      }
    }
  }

  isAlreadyConnected(user: object): Array<Socket> {
    const existingUser = this.users.get(user);
    if (existingUser) {
      return existingUser;
    }
    return null;
  }

  async createUser(userInfo: object, client: Socket) {
    const userConnected = this.isAlreadyConnected(userInfo);
    // console.log(userConnected)
    if (userConnected) {
      userConnected.push(client);
    } else this.users.set(userInfo, [client]);
    // console.log('users ', this.users)
  }
}
