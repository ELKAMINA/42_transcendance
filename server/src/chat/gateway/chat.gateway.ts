import { UserService } from 'src/user/user.service';
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

@WebSocketGateway(4002, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private ChatService: ChatService,
    private userService: UserService,
    private friends: FriendshipService,
  ) {}

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('ChatToServer')
  handleNewChatMessage(socket: Socket, dto: MessageDto): void {
    const roomId = socket.handshake.query.roomId as string;
    this.ChatService.createMessage(dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, dto);
  }

  // PROBABLY USELESS PLEASE DON'T UNCOMMENT
  // @SubscribeMessage('NotifNewPrivateConv')
  // handleNewPrivateConvCreated(socket: Socket, dto: MessageDto): void {
  // 	const roomId = socket.handshake.query.roomId as string;
  // 	this.ChatService.createMessage(dto);
  // 	this.server.to(roomId).emit('NotifNewPrivateConv:' + roomId, dto);
  // }

  @SubscribeMessage('newChannelCreated')
  handleNewChannelCreated(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('newChannelNotif');
  }

  @SubscribeMessage('ownerUpdate')
  handleOwnerUpdate(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('ownerUpdate');
  }

  @SubscribeMessage('channelDeleted')
  handleNewChannelDeleted(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('channelDeletedNotif');
  }

  @SubscribeMessage('justBanned')
  handleJustBannedNotif(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('justBannedNotif');
  }

  /*** ISSUE 88 ***/
  // CHANGE THE PAYLOAD STRUCTURE TO HANDLE:
  // - MESSAGE DTO (AS BEFORE THE FIX)
  // - THE USER WHO MUST BE KICKED
  // THEN ADDING NEW EMIT EVENT TO REQUEST KICK OF THE DEDICATED USER
  @SubscribeMessage('LeavingChannel')
  handleUserLeavingChannel(
    socket: Socket,
    body: { dto: MessageDto; userName: string },
  ): void {
    const roomId = socket.handshake.query.roomId as string;
    console.log('[Chat GATEWAY - LeavingChannel]', 'roomId: ', roomId);
    console.log('[Chat GATEWAY - LeavingChannel]', 'body.dto: ', body.dto);
    console.log(
      '[Chat GATEWAY - LeavingChannel]',
      'body.userName: ',
      body.userName,
    );
    this.ChatService.createMessage(body.dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, body.dto);
    this.server.to(roomId).emit('ServerToChatForKicking', body.userName);
    this.server.to(roomId).emit('channelKickNotif');
  }

  @SubscribeMessage('blockOrUnblockUser')
  async handleBlockOrUnblock(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    body: { sender: string; receiver: string; channelName: string },
  ): Promise<void> {
    // console.log('le body ', body);
    // const roomId = socket.handshake.query.roomId as string;
    const user = await this.userService.searchUser(body.sender);
    if (user) {
      const check = user.blocked.find((e) => e.login === body.receiver);
      if (check) {
        this.server.to(socket.id).emit('blockStatus', 'unblock');
      } else this.server.to(socket.id).emit('blockStatus', 'block');
    }
  }

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    // console.log('le body ', body);
    const roomId = socket.handshake.query.roomId as string;
    const blockedFriends = await this.friends.blockFriend(
      body.sender,
      body.receiver,
    );
    // this.server.to(roomId).emit('FriendBlocked', user)
    this.server
      .to(roomId)
      .emit('FriendBlocked', { senderReceiver: body, status: blockedFriends });
  }

  @SubscribeMessage('suggestingGame')
  async handleSuggestingGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    this.server.to(roomId).emit('respondingGame', body);
  }

  @SubscribeMessage('privateGame')
  async handlePrivateGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    this.server.to(roomId).emit('serverPrivateGame', body);
  }

  @SubscribeMessage('denyGame')
  async handleDenyGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    this.server.to(roomId).emit('gameDenied');
  }

  @SubscribeMessage('cancelGame')
  async handleCancelGame(@ConnectedSocket() socket: Socket): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    this.server.to(roomId).emit('gameCancelled');
  }

  @SubscribeMessage('userMutedByAdmin')
  async handleUserMuted(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;
    // console.log('From userMutedBy Admin ===== la roomId ', roomId);
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
    // console.log('channelConcerned ', channelConcerned);
    let channelsNameArr = new Array<string>();
    channelsNameArr = channelConcerned.split(',');
    // console.log('ARRAY', channelsNameArr);

    if (channelsNameArr.length > 0) {
      channelsNameArr.map((chan: string) => {
        this.server.to(chan).emit('UserUnmutedAfterExpiry', user);
      });
    }
  }
}
