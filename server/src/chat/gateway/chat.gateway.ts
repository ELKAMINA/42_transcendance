import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { MessageDto } from '../dto/messagePayload.dto';
import { ChatService } from '../chat.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { FriendshipService } from '../../friendship/friendship.service';
import { UserWithTime } from '../../channel/channel.controller';

@WebSocketGateway(4002, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private shut = 0;

  constructor(
    private ChatService: ChatService,
    private friends: FriendshipService,
  ) {}

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('ChatToServer')
  handleNewChatMessage(socket: Socket, dto: MessageDto): void {
    // console.log('Depuis chat Servver ', socket);
    const roomId = socket.handshake.query.roomId as string;
    this.ChatService.createMessage(dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, dto);
  }

  @SubscribeMessage('NotifNewPrivateConv')
  handleNewPrivateConvCreated(socket: Socket, dto: MessageDto): void {
    const roomId = socket.handshake.query.roomId as string;
    this.ChatService.createMessage(dto);
    this.server.to(roomId).emit('NotifNewPrivateConv:' + roomId, dto);
  }

  @SubscribeMessage('LeavingChannel')
  handleUserLeavingChannel(socket: Socket, dto: MessageDto): void {
    const roomId = socket.handshake.query.roomId as string;

    this.ChatService.createMessage(dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, dto);
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    // const roomId = socket.handshake.query.roomId as string;
    const user = await this.friends.blockFriend(body.sender, body.receiver);
    //   this.server.to(roomId).emit('FriendBlocked', user)
  }

  @SubscribeMessage('suggestingGame')
  async handleSuggestingGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    //   this.server.to(roomId).emit('FriendBlocked', user)
    // const [socketId, room] = socket.rooms;
    // console.log('la room ', sockets.rooms);
    // console.log('le body de la requete ', body);
    this.server.to(roomId).emit('respondingGame', body);
  }

  @SubscribeMessage('privateGame')
  async handlePrivateGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    //   this.server.to(roomId).emit('FriendBlocked', user)
    // const [socketId, room] = socket.rooms;
    // console.log('la room ', sockets.rooms);
    // console.log('le body de la requete ', body);
    this.server.to(roomId).emit('serverPrivateGame', body);
  }

  @SubscribeMessage('denyGame')
  async handleDenyGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    //   this.server.to(roomId).emit('FriendBlocked', user)
    // const [socketId, room] = socket.rooms;
    // console.log('la room ', sockets.rooms);
    // console.log('le body de la requete ', body);
    this.server.to(roomId).emit('gameDenied');
  }

  @SubscribeMessage('cancelGame')
  async handleCancelGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    //   this.server.to(roomId).emit('FriendBlocked', user)
    // const [socketId, room] = socket.rooms;
    // console.log('la room ', sockets.rooms);
    // console.log('le body de la requete ', body);
    this.server.to(roomId).emit('gameCancelled');
  }

  @SubscribeMessage('shut')
  async handleShut(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    console.log('From Shut ==== la roomId ', roomId);
    this.shut += 1;
    this.server.to(roomId).emit('newShut', this.shut);
  }

  @SubscribeMessage('userMutedByAdmin')
  async handleUserMuted(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    console.log('From userMutedBy Admin ===== la roomId ', roomId);
    this.server
      .to(roomId)
      .emit('userHasBeenMuted', { mutedUser: body, channelName: roomId });
  }

  handleConnection(socket: Socket) {
    // console.log('CONNECTED ', socket.id);
    const roomId = socket.handshake.query.roomId as string;
    socket.join(roomId);
  }

  handleDisconnect(socket: Socket) {
    // console.log('disconnec ', socket.id);
    const roomId = socket.handshake.query.roomId as string;
    socket.leave(roomId);
  }

  async notifyWhenUnmuted(user: string, channelConcerned: string) {
    // console.log('channel concerné ', channelConcerned);
    // console.log('user concerné ', user);
    const channelsNameArr = channelConcerned.split(',');
    // console.log('when a lot of channels ', channelsNameArr);
    const userWithTime = new Array<UserWithTime>();
    userWithTime.push({ login: user, ExpiryTime: null });
    if (channelsNameArr.length > 1) {
      channelsNameArr.map((chan) => {
        this.server.to(chan).emit('UserUnmutedAfterExpiry', {
          mutedUser: userWithTime,
          channelName: chan,
        });
      });
    } else {
      this.server.to(channelConcerned).emit('UserUnmutedAfterExpiry', {
        mutedUser: userWithTime,
        channelName: channelConcerned,
      });
    }
  }

  async unshut(user: string, channelConcerned: string) {
    const channelsNameArr = channelConcerned.split(',');
    // console.log('when a lot of channels ', channelsNameArr);
    const userWithTime = new Array<UserWithTime>();
    userWithTime.push({ login: user, ExpiryTime: null });
    if (channelsNameArr.length > 1) {
      channelsNameArr.map((chan) => {
        this.server.to(chan).emit('unshut');
      });
    } else {
      this.server.to(channelConcerned).emit('unshut');
    }
  }
}
