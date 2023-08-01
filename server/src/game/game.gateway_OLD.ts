// import { Injectable, Res } from '@nestjs/common';
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';
// import { Response } from 'express';
// import { GameDto } from './dto/game.dto';
// import { UserService } from 'src/user/user.service';
// import { FriendshipGateway } from 'src/friendship/friendship.gateway';
// import { GameService } from './game.service';

// @WebSocketGateway(4010, { cors: '*' })
// @Injectable()
// export class GameGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   constructor(
//     private userService: UserService,
//     private friendshipGateway: FriendshipGateway,
//     private gameService: GameService,
//   ) {}

//   @WebSocketServer() server: Server;

//   // ARRAY OF EVERY GAME IN PROGRESS OR IN WAITING OF AN OPPONENT
//   private games: Array<gameDto> = new Array<gameDto>();

//   async handleConnection(
//     @ConnectedSocket() client: Socket,
//     @Res() response: Response,
//     ...args: Socket[]
//   ) {}

//   /* Match making events */

//   @SubscribeMessage('changeStatus')
//   async handleChangeStatus(client: Socket, payload: string): Promise<void> {
//     await this.userService.updateData(payload, { status: 'Playing' });
//     this.server.to(client.id).emit('statusChanged');
//   }

//   @SubscribeMessage('joinRoom')
//   async handlejoinRoom(client: Socket, payload: string): Promise<void> {
//     let room: gameDto | undefined = this.games.find(
//       (element) => element.players.length === 1,
//     );
//     if (this.games.length === 0 || room === undefined) {
//       room = {
//         id: payload,
//         createdDate: new Date(),
//         totalSet: 1,
//         totalPoint: 6,
//         mapName: 'Default',
//         power: false,
//         isFull: false,
//         players: new Array<string>(),
//         playerOneId: client.id,
//         playerTwoId: '0',
//         collided: true,
//         scorePlayers: new Array<number>(),
//       };
//       room.players.push(payload);
//       room.scorePlayers.push(0);
//       room.scorePlayers.push(0);
//       this.games.push(room);
//       // this.server.to((room.playerOneId)).emit('waitingForOpponent')
//     } else {
//       room.isFull = true;
//       room.players.push(payload);
//       room.playerTwoId = client.id;
//       this.server
//         .to(room.playerOneId)
//         .emit('gameBegin', { opponent: room.players[1], allRoomInfo: room });
//       this.server
//         .to(room.playerTwoId)
//         .emit('gameBegin', { opponent: room.players[0], allRoomInfo: room });
//     }
//     client.join(room.id);
//     this.server.to(client.id).emit('roomJoined', room.id);
//     console.log('creation de rooms : games ', this.games);

//     return;
//   }

//   /* ********** */

//   /* Game events */
//   @SubscribeMessage('requestMovePaddle')
//   async handleRequestMovePaddle(client: Socket, value: number): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     const room = this.games.find((el) => el.id === roomName);
//     const player =
//       room.playerOneId === socketId ? room.playerOneId : room.playerTwoId;
//     this.server.to(roomName).emit('updateMovePaddle', { player, value });
//   }

//   @SubscribeMessage('requestMoveBall')
//   async handleRequestMoveBall(
//     client: Socket,
//     value: { positions: Array<number>; velocity: Array<number> },
//   ): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     this.server.to(roomName).emit('updateMoveBall', value);
//   }

//   @SubscribeMessage('requestAfterPaddleCollision')
//   async handlerequestAfterPaddleCollisionl(
//     client: Socket,
//     value: {
//       positions: Array<number>;
//       velocity: Array<number>;
//       canBeCollided: boolean;
//     },
//   ): Promise<void> {
//     // console.log('value ', value);
//     const [socketId, roomName] = [...client.rooms];
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     this.server.to(roomName).emit('updateAfterPaddleCollision', value);
//   }

//   @SubscribeMessage('requestResetPositionBall')
//   async handleRequestResetPositionBall(
//     client: Socket,
//     value: { positions: Array<number>; canBeCollided: boolean },
//   ): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     this.server.to(roomName).emit('updatePositionBall', value);
//   }

//   @SubscribeMessage('requestResetPositionPlayer')
//   async handleRequestResetPositionPlayer(
//     client: Socket,
//     value: { player1Position: Array<number>; player2Position: Array<number> },
//   ): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     this.server.to(roomName).emit('updatePositionPlayer', value);
//   }

//   @SubscribeMessage('requestPlayerScore')
//   async handleRequestPlayerScore(client: Socket, value: string): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     const room = this.games.find((el) => el.id === roomName);
//     if (value === socketId) {
//       room.scorePlayers[0] += 1;
//     } else room.scorePlayers[1] += 1;
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     this.server.to(roomName).emit('updatePlayerScore', room.scorePlayers);
//   }

//   @SubscribeMessage('requestEndOfGame')
//   async handleRequestEndOfGame(client: Socket, value: string): Promise<void> {
//     // console.log('rooms ', client.rooms);
//     const [socketId, roomName] = [...client.rooms];
//     const room = this.games.find((el) => el.id === roomName);
//     console.log(' Score at the end of the game : ', room.scorePlayers);
//     this.gameService.matchCreation(room);
//     // console.log(`socket id ${socketId} in the room ${roomName}`);
//     // this.server.to(roomName).emit('updatePlayerScore', room.scorePlayers);
//   }

//   // @SubscribeMessage('connectedSocket') // Verifier les id des sockets
//   // async handleConnectedSocket(client: Socket): Promise<void> {
//   // 	console.log('je me connnecte à partir de Game ', client.id)
//   //   return;
//   // }

//   /* ********** */

//   async handleDisconnect(client: Socket) {
//     console.log('Disconnection Client Id', client.id);
//     const user = this.friendshipGateway.getUserInfoFromSocket(
//       client.handshake.headers.cookie,
//     );
//     // const game = this.games.find(user.login);
//     // console.log(game);
//     // const opponent = game.
//     console.log(' user a la deconnexion ', user);

//     /*
// 	Find the room where the client is the owner
// 	IF ROOM ==> CLIENT IS OWNER
// 	GET THE SECOND PLAYER FROM ROOM DTO
// 	EMIT A DISCONNECTION MESSAGE TO THE SECOND PLAYER
// 	SAVE THE ROOM ID (NICKANME OF THE OWNER) FROM THE GAMES ARRAY
// 	EMIT A DISCONNECTION MESSAGE TO THE OWMER
// 	REMOVE THE ROOM FROM THE GAMES ARRAY
// 	*/
//     const room = this.games.find((el) => el.id === user.nickname);
//     if (room) {
//       console.log(`The client ${user.nickname} is the owner`);
//       if (room.playerTwoId) {
//         this.server.to(room.playerTwoId).emit('forceDisconnection');
//       }
//     } else {
//       const toDelete = this.findingRoomByPlayer(this.games, user.nickname);
//       console.log(' to delete ', toDelete);
//       if (toDelete) {
//         toDelete.playerTwoId = undefined;
//         this.server.to(toDelete.playerOneId).emit('forceDisconnection');
//       }
//     }
//     this.games = this.games.filter((el) => el.id !== user.nickname);
//     await this.userService.updateData(user.nickname, { status: 'Online' });
//     console.log('A la deconnexion : games ', this.games);
//   }

//   async afterInit(server: Server) {}

//   findingRoomByPlayer(
//     data: gameDto[],
//     attributeToFind: string,
//   ): gameDto | undefined {
//     for (const room of data) {
//       const foundItem = room.players.find((item) => item === attributeToFind);
//       if (foundItem) {
//         return room;
//       }
//     }
//     return undefined; // Return undefined if the value is not found in the nested array
//   }
// }
