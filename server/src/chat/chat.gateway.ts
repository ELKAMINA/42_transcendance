import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayInit,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: '*' }) // every front client can connect to our gateway. Marks the class as the WebSocket gateway<; This is a socket constructor
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //OnGatewayConnection : means that we want it to run when anyone connects to the server
  @WebSocketServer()
  server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Gateway Initialized');
    // console.log(server);
  } // For logging message in the console (what is in yellow and green is the logger)

  //Whenever we want to handle message in the server, We use this decorator to handle it. MsgToServer is the name of the event he is waiting for
  handleConnection(client: Socket, ...args: Socket[]) {
    // console.log(client);
    console.log('arrrgs ', args);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(client);
    this.logger.log(`Client disconnected: ${client.id}`);
    // throw new Error('Method not implemented');
  }

  @SubscribeMessage('MsgToServer')
  // Handle message has 3 equivalent code inside that does the same
  /* 1st */
  // handleMessage(client: Socket, text: string): object {
  //   console.log(client);
  //   return { event: 'MsgToClient', data: text };
  // }
  /* 2nd */
  handleMessage(client: Socket, text: string): WsResponse<string> {
    console.log('le texxxte ', text);
    this.server.emit('message', 'test');
    return { event: 'MsgToClient', data: text };
  }
  /* 3rd */
  // handleMessage(client: any, text: string): void {
  //   this.wss.emit('msgToClient', text);
  // }
}
