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
  async handleNewChatMessage(socket: Socket, dto: MessageDto): Promise<void> {
    const roomId = socket.handshake.query.roomId as string;

    try {
      const isSuccess = await this.ChatService.createMessage(dto);
      if (isSuccess) {
        this.server.to(roomId).emit('ServerToChat:' + roomId, dto);
      } else {
        this.server.emit('channelDeletedNotif', dto.channel);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('newChannelCreated')
  handleNewChannelCreated(socket: Socket, userName: string): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] userName = ", userName);
    this.server.emit('newChannelNotif', userName);
  }

  @SubscribeMessage('ownerUpdate')
  handleOwnerUpdate(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('ownerUpdate');
  }

  @SubscribeMessage('memberUpdate')
  handleMemberUpdate(socket: Socket): void {
    this.server.emit('memberUpdate');
  }

  @SubscribeMessage('adminUpdate')
  handleAdminUpdate(socket: Socket): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('adminUpdate');
  }

  @SubscribeMessage('channelDeleted')
  handleNewChannelDeleted(socket: Socket, deletedChannelName: string): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] deletedChannelName = ", deletedChannelName);
    this.server.emit('channelDeletedNotif', deletedChannelName);
  }

  @SubscribeMessage('bannedNotif')
  handleJustBannedNotif(socket: Socket, userName: string): void {
    // const roomId = socket.handshake.query.roomId as string;
    // console.log("[chatGateway] roomId = ", roomId);
    this.server.emit('bannedNotif', userName);
  }

  @SubscribeMessage('LeavingChannel')
  handleUserLeavingChannel(socket: Socket, dto: MessageDto): void {
    const roomId = socket.handshake.query.roomId as string;

    this.ChatService.createMessage(dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, dto);
    this.server.emit('leavingChannelNotif', dto.sentBy);
  }

  @SubscribeMessage('kickedMember')
  handleUserKick(
    socket: Socket,
    body: { dto: MessageDto; userName: string },
  ): void {
    const roomId = socket.handshake.query.roomId as string;

    this.ChatService.createMessage(body.dto);
    this.server.to(roomId).emit('ServerToChat:' + roomId, body.dto);

    this.server.emit('kickUpdate', body.userName, roomId);
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

  // vérifier que l'utilisateur qui se connecte est bien membre
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

  /** ISSUE 113 - TEST AUTO REFRESH WHEN USER NAME CHANGING ***/
  @SubscribeMessage('autoRefreshWhenUsernameChanging')
  async autoRefreshWhenUsernameChanging(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.server.emit('autoRefreshWhenUsernameChanging');
  }
}
