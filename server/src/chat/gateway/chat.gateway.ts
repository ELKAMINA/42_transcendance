import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageDto } from '../dto/messagePayload.dto';
import { ChatService } from '../chat.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(4002, {cors:'*'}) // we want every front and client to be able to connect with our gateway
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server : Server;

	constructor(private ChatService: ChatService) {};

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
  
	handleConnection(socket: Socket) {
	  	const roomId = socket.handshake.query.roomId as string;
		console.log('je rentre ici ???');
	  	// const username = socket.handshake.query.username as string;
	  	socket.join(roomId);
		// const welcomeMessage = {
		// 	sentBy: username,
		// 	senderSocketId: socket.id, 
		// 	message: `${username} entered the chat`,
		// 	sentAt: new Date(),
		// 	incoming: false,
		// 	outgoing: true,
		// 	subtype: 'infoMsg',
		// 	channel: roomId,
		// 	channelById: roomId,
		// }
		// this.server.to(roomId).emit('userEntered:' + roomId, welcomeMessage)
	  	// console.log(`Client ${socket.id} connected to ${roomId}`);
	}
  
	handleDisconnect(socket: Socket) {
		const roomId = socket.handshake.query.roomId as string;
		// const username = socket.handshake.query.username as string;
	  	socket.leave(roomId);
		//   const goodbyeMessage = {
		// 	sentBy: username,
		// 	senderSocketId: socket.id, 
		// 	message: `${username} left the chat`,
		// 	sentAt: new Date(),
		// 	incoming: false,
		// 	outgoing: true,
		// 	subtype: 'infoMsg',
		// 	channel: roomId,
		// 	channelById: roomId,
		// }
		// this.server.to(roomId).emit('userLeft:' + roomId, goodbyeMessage)
	  	// console.log(`Client ${socket.id} disconnected from ${roomId}`);
	}
}