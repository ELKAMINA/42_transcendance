import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { UserService } from 'src/user/user.service';
import { FriendshipGateway } from 'src/friendship/friendship.gateway';
import { GameService } from './game.service';

@WebSocketGateway(4010, { cors: '*' })
@Injectable()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private friendshipGateway: FriendshipGateway,
    private gameService: GameService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket, ...args: Socket[]) {
    // WARNING: ADD A SECURITY ??
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    console.log(`Socket connection >>${client.id}<< user: >>${user}<<`);
  }

  async handleDisconnect(client: Socket) {
    // WARNING: ADD A SECURITY ??
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    console.log(
      `Socket disconnection >>${client.id}<< user: >>${user.nickname}<<`,
    );
  }
}
