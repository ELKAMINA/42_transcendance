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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageBody } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { FriendshipService } from './friendship.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway(4006, {
  // namespace: 'friendship',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
}) // every front client can connect to our gateway. Marks the class as the WebSocket gateway<; This is a socket constructor
@Injectable()
export class FriendshipGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //OnGatewayConnection : means that we want it to run when anyone connects to the server
  @WebSocketServer() io: Namespace;

  private users: Map<object, Array<Socket>> = new Map<object, Array<Socket>>();

  private i = 0;

  constructor(
    private userServ: UserService,
    private prisma: PrismaService,
    private friends: FriendshipService,
    private auth: AuthService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private logger: Logger = new Logger('FriendshipGateway');

  afterInit() {
    this.logger.log('Gateway Initialized');
  } // For logging message in the console (what is in yellow and green is the logger)

  //Whenever we want to handle message in the server, We use this decorator to handle it. MsgToServer is the name of the event he is waiting for
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      this.i += 1;
      //   console.log(`Socket n° ${this.i}`);
      // const sockets = this.io.sockets; // toutes les sockets connectées
      // const user = await this.verifyJwtSocketConnections(client);
      // if (user.accessToken){
      //   this.io.emit('newCookie', user)
      // }
      // this.io.emit('newUserConnected', client.handshake.headers.cookie);
      // this.logger.log(`WS Client with id: ${client.id}  connected!`);
      // this.logger.debug(`Number of connected sockets ${sockets.size}`);
      // this.logger.log(`Client connected: ${client.id}`);
    } catch (e) {
      console.log('Socket connection not established ');
    } // console.log('users connected ', this.users);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      this.users.delete(client);

      // const sockets = this.io.sockets;
      // this.logger.log(`WS Client with id: ${client.id}  disconnected!`);
      // this.logger.debug(`Number of connected sockets ${sockets.size}`);
    } catch (e) {
      console.log('ON CONNECTION ERROR', e);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('ERROR', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('friendReq')
  async handleFriendRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    // const user = await this.verifyJwtSocketConnections(socket);
    const newReq = await this.friends.requestFriendship(
      body.sender,
      body.receiver.nickname,
    );
    // console.log('oui 2');
    this.io.emit('friendAdded', newReq);
  }

  @SubscribeMessage('acceptFriend')
  async acceptFriendRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    // await this.verifyJwtSocketConnections(socket);
    const user = await this.friends.acceptFriend(
      body.sender,
      body.receiver.nickname,
    );
    this.io.emit('acceptedFriend', user);
  }

  @SubscribeMessage('denyFriend')
  async denyFriendRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    // await this.verifyJwtSocketConnections(socket);
    const user = await this.friends.denyFriend(
      body.sender.nickname,
      body.receiver,
    );
    this.io.emit('denyFriend', user);
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    // await this.verifyJwtSocketConnections(socket);
    const user = await this.friends.blockFriend(
      body.sender,
      body.receiver.nickname,
    );
    this.io.emit('blockedFriend', { status: user, senderReceiver: body });
  }

  isAlreadyConnected(user: object): Array<Socket> {
    const existingUser = this.users.get(user);
    if (existingUser) {
      return existingUser;
    }
    return null;
  }

  getUserInfoFromSocket(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }

  findKeyByValue(map, searchValue) {
    for (const [key, value] of map.entries()) {
      if (value.includes(searchValue)) {
        return key;
      }
    }
    return null; // Value not found in the Map
  }

  @SubscribeMessage('realTimeUsers')
  async allUsers(@ConnectedSocket() client: Socket) {
    const user = this.findKeyByValue(this.users, client);
    const allUsers = (await this.userServ.findAll()).filter(
      (us) => us.login != user,
    );
    this.io.emit('realTimeUsers', user);
  }

  async verifyJwtSocketConnections(client: Socket) {
    let newTokens = null;
    let userInfo;
    if (client.handshake.headers.cookie) {
      userInfo = this.getUserInfoFromSocket(client.handshake.headers.cookie);
    }
    try {
      await this.jwt.verifyAsync(userInfo.accessToken, {
        secret: this.config.get('ACCESS_TOKEN'),
      });
      this.createUser(userInfo, client);
      return userInfo;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        try {
          newTokens = await this.auth.refresh(
            userInfo.nickname,
            userInfo.refreshToken,
          );
          //   console.log('new tokens ', newTokens);
          const data: object = {
            nickname: userInfo.nickname,
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
          };
          return data;
        } catch (e) {
          throw new ForbiddenException('Invalid access and refresh tokens');
        }
      }
    }
  }

  async createUser(userInfo: object, client: Socket) {
    const userConnected = this.isAlreadyConnected(userInfo);
    if (userConnected) userConnected.push(client);
    else this.users.set(userInfo, [client]);
  }

  /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
  @SubscribeMessage('autoRefreshWhenUsernameChanging')
  async autoRefreshWhenUsernameChanging(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.io.emit('autoRefreshWhenUsernameChanging');
  }
}
