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
  import { Injectable, Logger, UnauthorizedException, Res, ForbiddenException } from '@nestjs/common';
  
  import { AuthService } from 'src/auth/auth.service';
  import { UserService } from 'src/user/user.service';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { HomeService } from './home.service';
  // import { MyMiddleware } from 'src/socket/socket.middleware';
  // import { AuthService } from 'src/auth/auth.service';
  // namespace: '/friendship',
  // cors: { origin: 'http://localhost:3000', credentials: true }
  
//   @WebSocketGateway({
//     namespace: 'profile',
//     cors: {
//       origin: ['http://localhost:3000'],
//       credentials: true,
//     },
//   }) // every front client can connect to our gateway. Marks the class as the WebSocket gateway<; This is a socket constructor
  @WebSocketGateway(4003, {cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  }})
  @Injectable()
  export class ProfileGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    //OnGatewayConnection : means that we want it to run when anyone connects to the server
    @WebSocketServer() io : Namespace;
  
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
      try {
        // const sockets = this.io.sockets; // toutes les sockets connectées
        // console.log('test ', this.server)
        // console.log('client ', client);
        // console.log('al reponse ', response);
        // this.io.emit('newUserConnected', {});
        this.logger.log(`WS Client with id: ${client.id}  connected!`);
        // this.logger.debug(`Number of connected sockets ${sockets.size}`);
        this.logger.log(`Client connected: ${client.id}`);
        this.verifyJwtSocketConnections(client, response);
      } catch(e) {
        console.log('A la connexion ça a merdé ', e);
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
  
    @SubscribeMessage('changeProfile')
    async changeProfile(
      @ConnectedSocket() socket: Socket,
      @MessageBody() body: any,
    ) {
        // console.log('les sockets ', socket.id)
        // console.log('... client sending :', body);
        const newInfos = await this.userServ.updateUserInfo(body)
    //   await this.friends.requestFriendship(body.sender, body.receiver.nickname);
        this.io.emit('UpdateInfoUser',  newInfos);
    }

    getUserInfoFromSocket(cookie: string) {
        const { Authcookie: userInfo } = parse(cookie);
        const idAtRt = JSON.parse(userInfo);
        return idAtRt;
      }

    async verifyJwtSocketConnections(client: Socket, response: Response) {
        let newTokens;
        // console.log('Coookie ', client.handshake.headers.cookie);
        const userInfo = this.getUserInfoFromSocket(
          client.handshake.headers.cookie,
        );
        try {
            await this.jwt.verifyAsync(userInfo.accessToken, {
                secret: this.config.get('ACCESS_TOKEN'),
            });
            // console.log('userInfo ', userInfo)
          this.createUser(userInfo, client);
        } catch(error: any) {
          // console.log("ERRROOOOOOR ", error);
          if (error.name === 'TokenExpiredError') {
            try {
              // console.log('ancien refresh tokens ', userInfo.refreshToken);
              // console.log("user NICKNAME ", userInfo.nickname);
              newTokens = await this.auth.refresh(
                userInfo.nickname,
                userInfo.refreshToken,
              );
              const data: object = {
                nickname: userInfo.nickname,
                accessToken: newTokens.access_token,
                refreshToken: newTokens.refresh_token,
              };
              // console.log("data avant serializarion ", data);
              axios
                .post('http://127.0.0.1:4001/auth/update-cookie', data)
                .then((res) => {
                //   console.log('la response ', res);
                })
                .catch((e) => console.log('erooor ', e));
            //   this.io.emit('newCookie', data);
              return newTokens;
            } catch(e) {
              console.log('lerreuuuuuur ', e);
              throw new ForbiddenException('Invalid access and refresh tokens');
            }
          }
          // return newTokens;
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
        }
        else this.users.set(userInfo, [client]);
        // console.log('users ', this.users)
      }
 
  }
  