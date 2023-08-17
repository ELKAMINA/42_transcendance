import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageDto } from '../dto/messagePayload.dto';
import { ChatService } from '../chat.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { FriendshipService } from '../../friendship/friendship.service';


@WebSocketGateway(4002, {cors:'*'}) // we want every front and client to be able to connect with our gateway
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server : Server;

	constructor(private ChatService: ChatService, private friends: FriendshipService,
		) {};

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

	/*** ISSUE 88 ***/
	// CHANGE THE PAYLOAD STRUCTURE TO HANDLE:
	// - MESSAGE DTO (AS BEFORE THE FIX)
	// - THE USER WHO MUST BE KICKED
	// THEN ADDING NEW EMIT EVENT TO REQUEST KICK OF THE DEDICATED USER
	@SubscribeMessage('LeavingChannel')
	handleUserLeavingChannel(socket: Socket, body: {dto: MessageDto, userName: string} ): void {
	  const roomId = socket.handshake.query.roomId as string;
	  console.log("[Chat GATEWAY - LeavingChannel]", "roomId: ", roomId);
	  console.log("[Chat GATEWAY - LeavingChannel]", "body.dto: ", body.dto);
	  console.log("[Chat GATEWAY - LeavingChannel]", "body.userName: ", body.userName);
	  this.ChatService.createMessage(body.dto);
	  this.server.to(roomId).emit('ServerToChat:' + roomId, body.dto);
	  this.server.to(roomId).emit('ServerToChatForKicking', body.userName);
	}
  
	@SubscribeMessage('blockUser')
	async handleBlockUser(socket: Socket, @MessageBody() body: any,
	): Promise<void> {
		// const roomId = socket.handshake.query.roomId as string;
		const user = await this.friends.blockFriend(
			body.sender,
			body.receiver,
		  );
		//   this.server.to(roomId).emit('FriendBlocked', user)
	}

	handleConnection(socket: Socket) {
	  	const roomId = socket.handshake.query.roomId as string;
	  	socket.join(roomId);
		  console.log("[CHAT GATEWAY - handleConnection]", socket);
	}
  
	handleDisconnect(socket: Socket) {
		const roomId = socket.handshake.query.roomId as string;
	  	socket.leave(roomId);
		console.log("[CHAT GATEWAY - handleDisconnect]", socket);
	}
}