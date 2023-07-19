import { Injectable, Logger, UnauthorizedException, Res, ForbiddenException } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
  } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { Response } from 'express';
import { gameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/user/types';
import { FriendshipGateway } from 'src/friendship/friendship.gateway';

@WebSocketGateway(4010, {cors: "*"})
@Injectable()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private userService: UserService,
		private friendshipGateway: FriendshipGateway
	) {};

	@WebSocketServer() server: Server;

	 // ARRAY OF EVERY GAME IN PROGRESS OR IN WAITING OF AN OPPONENT
	private games: Array<gameDto> = new Array<gameDto>();

  @SubscribeMessage('changeStatus')
  async handleChangeStatus(client: Socket, payload: string): Promise<string> {
	  let user = await this.userService.searchUser(payload);
	   user =  await this.userService.updateData(user.login, { status: 'Playing'});
	  this.server.emit("statusChanged", user);
    return;
  }

  @SubscribeMessage('joinRoom')
  async handlejoinRoom(client: Socket, payload: string): Promise<void> {
	let room : gameDto | undefined = this.games.find((element) => element["players"].length === 1);
	console.log("ROOOOOM ", room)
	if (this.games.length  === 0 || room === undefined) {
		console.log (' je creee une nouvelle room ')
		room = {
			id: payload,
			createdDate: Date.now(),
			totalSet: 1,
			totalPoint: 2,
			mapName: "Default",
			power: false,
			isFull: false,
			players: new Array<string>(),
			scorePlayers: new Array<number>(),
		}
		room.players.push(payload);
		room.scorePlayers.push(0);
		room.scorePlayers.push(0);
		this.games.push(room);
	}
	else {
		room.isFull = true;
		room.players.push(payload)
	}
	client.join(room.id)
	this.server.emit("roomJoined", room.id);
	console.log("creation de rooms : games ", this.games)

	return;
}

  async handleConnection(
	@ConnectedSocket() client: Socket,
    @Res() response: Response,
    ...args: Socket[]
  ) {
  }

  async handleDisconnect(client: Socket) {
	console.log('Disconnection Client Id', client.id);
	const user = this.friendshipGateway.getUserInfoFromSocket(client.handshake.headers.cookie)
	this.games.filter((el) => el.id === user.login)
	console.log("A la deconnexion : games ", this.games)
  }

  async afterInit(server: Server) {
	
  }


}
