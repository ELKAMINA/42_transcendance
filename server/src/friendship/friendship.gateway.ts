import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { MessageBody } from '@nestjs/websockets';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

// import { AuthService } from 'src/auth/auth.service';
// namespace: '/friendship',
// cors: { origin: 'http://localhost:3000', credentials: true }

@WebSocketGateway({
  namespace: 'friendship',
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4100'],
    credentials: true,
  },
}) // every front client can connect to our gateway. Marks the class as the WebSocket gateway<; This is a socket constructor
@Injectable()
export class FriendshipGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //OnGatewayConnection : means that we want it to run when anyone connects to the server
  @WebSocketServer() io: Namespace;

//   constructor(
//     private config: ConfigService,
//     private auth: AuthService,
//     private userServ: UserService,
//   ) {}

  private logger: Logger = new Logger('FriendshipGateway');

  afterInit(server: Server) {
    this.logger.log('Gateway Initialized');
    // console.log(server);
  } // For logging message in the console (what is in yellow and green is the logger)

  //Whenever we want to handle message in the server, We use this decorator to handle it. MsgToServer is the name of the event he is waiting for
  async handleConnection(client: Socket, ...args: Socket[]) {
    try {
      const sockets = this.io.sockets;
      console.log('Client ', client.handshake.headers);
      this.logger.log(`WS Client with id: ${client.id}  connected!`);
      this.logger.debug(`Number of connected sockets ${sockets.size}`);
      // const test = JSON.parse(client.handshake.headers.cookie);
      // console.log(test.accessToken);
      // const userPayload = await this.auth.verifyJwt(
      //   client.handshake,
      // );
      // console.log('client ', userPayload); // Give sub/nickname, iat ...
      // const user = await this.userServ.searchUser(userPayload.nickname);
      // if (!user) {
      //   console.log('We have to disconnect the socket');
      //   return this.disconnect(client);
      // }
      // console.log("Le user ", user);

      this.logger.log(`Client connected: ${client.id}`);

    } catch (e) {
      console.log('ON CONNECTION ERROR, We have to disconnect the socket', e);
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const sockets = this.io.sockets;

      this.logger.log(`WS Client with id: ${client.id}  disconnected!`);
      this.logger.debug(`Number of connected sockets ${sockets.size}`);
    } catch (e) {
      console.log('ON CONNECTION ERROR', e);
    }
    // console.log(client);
    // throw new Error('Method not implemented');
  }

  private disconnect(socket: Socket) {
    socket.emit('ERROR', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('friendReq')
  // Handle message has 3 equivalent code inside that does the same
  /* 1st */
  // handleMessage(client: Socket, text: string): object {
  //   console.log(client);
  //   return { event: 'MsgToClient', data: text };
  // }
  /* 2nd */
  handleMessage(@MessageBody() body: any, client: Socket) {
    console.log('... client sending :', body);
    // client.on(onMessage, (data) => {
    //   console.log(data);
    // });
  }
  /* 3rd */
  // handleMessage(client: any, text: string): void {
  //   this.wss.emit('msgToClient', text);
  // }
}
