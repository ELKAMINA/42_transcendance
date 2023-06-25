import { FriendshipService } from './friendship.service';
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
import { JwtService } from '@nestjs/jwt';
import { MessageBody } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
// import { MyMiddleware } from 'src/socket/socket.middleware';
import { ExtendedError } from 'socket.io/dist/namespace';
// import { AuthService } from 'src/auth/auth.service';
// namespace: '/friendship',
// cors: { origin: 'http://localhost:3000', credentials: true }

@WebSocketGateway({
  namespace: 'friendship',
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

  constructor(
    private userServ: UserService,
    private prisma: PrismaService,
    private friends: FriendshipService,
    private auth: AuthService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  private logger: Logger = new Logger('FriendshipGateway');

  afterInit(server: Server) {
    this.logger.log('Gateway Initialized');
    // server.use((socket: Socket, next: (err?: ExtendedError) => void) =>
    //   MyMiddleware.prototype.use(socket, next),
    // );
    // console.log('Serveeer', server);
  } // For logging message in the console (what is in yellow and green is the logger)

  //Whenever we want to handle message in the server, We use this decorator to handle it. MsgToServer is the name of the event he is waiting for
  async handleConnection(@ConnectedSocket() client: Socket, ...args: Socket[]) {
    try {
      const sockets = this.io.sockets; // toutes les sockets connectées
      const userInfo = this.getUserInfoFromSocket(
        client.handshake.headers.cookie,
      );
      console.log('le type de userInfo ', typeof userInfo);
      const at = await this.jwt.verifyAsync(userInfo.accessToken, {
        secret: this.config.get('ACCESS_TOKEN'),
      }).catch((error) => {
          if (error) {
            console.log(error);
            const newTokens = this.auth.refresh(at, userInfo.refreshToken);
            console.log(newTokens);
          }
        }
      )
      console.log('AT ', at);
      const userConnected = this.isAlreadyConnected(userInfo);
      if (userConnected) userConnected.push(client);
      else this.users.set(userInfo, [client]);
      // console.log('all users ', allUsers);
      this.io.emit('newUserConnected', {});
      this.logger.log(`WS Client with id: ${client.id}  connected!`);
      this.logger.debug(`Number of connected sockets ${sockets.size}`);

      this.logger.log(`Client connected: ${client.id}`);
      // console.log('users connected ', this.users);

    } catch (e) {
      console.log('ON CONNECTION ERROR, We have to disconnect the socket', e);
      return this.disconnect(client);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      console.log('je rentre ici quand ca rafraichit ');
      const sockets = this.io.sockets;
      // this.users.delete(client);
      
      this.logger.log(`WS Client with id: ${client.id}  disconnected!`);
      this.logger.debug(`Number of connected sockets ${sockets.size}`);
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
    console.log('... client sending :', body);
    await this.friends.requestFriendship(body.sender, body.receiver.nickname);
    return { event: 'friendAdded', data: '' };
  }

  @SubscribeMessage('acceptFriend')
  async acceptFriendRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    console.log('... client sending :', body);
    const user = await this.friends.acceptFriend(
      body.sender,
      body.receiver.nickname,
    );
    return { event: 'acceptedFriend', data: user };
  }

  @SubscribeMessage('denyFriend')
  async denyFriendRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    console.log('... client sending :', body);
    const user = await this.friends.denyFriend(
      body.sender.nickname,
      body.receiver,
    );
    return { event: 'denyFriend', data: user };
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    console.log('... client sending :', body);
    const user = await this.friends.blockFriend(
      body.sender.nickname,
      body.receiver,
    );
    return { event: 'blockFriend', data: user };
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
    console.log('Le user ', user);
    const allUsers = (await this.userServ.findAll()).filter(
      (us) => us.login != user,
    );
    return { event: 'realTimeUsers', data: allUsers };
  }
}
