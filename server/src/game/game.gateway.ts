import { Injectable, Body } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { FriendshipGateway } from '../friendship/friendship.gateway';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import {
  EServerPlayType,
  EGameServerStates,
  ERoomStates,
} from './enum/EServerGame';

@WebSocketGateway(4010, { cors: '*' })
@Injectable()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private friendshipGateway: FriendshipGateway,
    private gameService: GameService,
  ) {}

  @WebSocketServer() server: Server;

  // CONTAINS EVERY CREATED GAME ROOM
  private allRooms: Array<GameDto> = new Array<GameDto>();
  // CONTAINS EVERY CONNECTED SOCKETS USER
  private socketsPool: Map<string, Socket> = new Map<string, Socket>();

  async handleConnection() {
    this.socketsPool.forEach((element, key, map) => {
      console.log(
        '[GATEWAY - handleConnection]',
        'Socket Pool:',
        'key: ',
        key,
        'value: ',
        element,
      );
    });
  }

  async handleDisconnect(client: Socket) {
    let room: GameDto; // UNDEFINED
    // TODO: ADD A SECURITY ??
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    if (!user) {
      console.error('[GATEWAY - handleDisconnect] USER NOT FOUND');
    }
    console.log('[GATEWAY - handleDisconnect]', 'user: ', user);
    room = this.userInRoom(user.nickname);
    if (!room) {
      console.log(
        '[GATEWAY - handleDisconnect]',
        'The player is not linked to a room (leaving settings screen or else): ',
        user.nickname,
      );
    } else {
      // DELETE THE ROOM OF THE USER IF HE IS THE OWNER AND ALONE IN THE ROOM (WAITING)
      // USE CASE:
      // - PLAYER TYPE RANDOM AND NO OPPONENT IS COMING TO THE ROOM
      // - PLAYER TYPE ONE TO NONE BUT THE OPPONENT HAS LEFT THE ROOM BEFORE THE END OF GAME SETTINGS
      if (
        room.id === user.nickname &&
        room.isFull === false &&
        room.roomStatus === ERoomStates.WaitingOpponent
      ) {
        console.log(
          '[GATEWAY - handleDisconnect]',
          'The player has left the game during the waiting opponent: ',
          user.nickname,
        );
        this.removeRoom(room.id);
      }
      // USE CASES:
      // - DISCONNECTION OF ONE OF BOTH PLAYERS IN VERSUS SCREEN
      // - RAGEQUIT
      // - ENDGAME (FIRST DISCONNECTION OF A PLAYER)
      else if (room.isFull === true) {
        // DISCONNECTION OF ONE OF BOTH PLAYERS IN VERSUS SCREEN
        if (room.roomStatus === ERoomStates.Busy) {
          console.warn(
            '[GATEWAY - handleDisconnect]',
            'The player has left the game during versus screen: ',
            user.nickname,
          );
          this.server.to(room.id).emit('updateComponent', {
            status: EGameServerStates.HOMEPAGE,
            room: room,
          });
        } else if (room.roomStatus === ERoomStates.GameOn) {
          // RAGE QUIT / DISCONNECTION OF ONE OF BOTH PLAYERS DURING A GAME
          // FORCE THE SCORE OF THE ROOM ACCORDING TO THE PLAYER WHO
          // HAS LEFT THE ROOM
          console.warn(
            '[GATEWAY - handleDisconnect]',
            'The player has left the game (disconnection or rage quit): ',
            user.nickname,
          );
          this.forceScore(user.nickname, room);
          this.createMatchHistory(room);
          // SEND THE OPPONENT ON THE END GAME SCREEN
          this.server.to(room.id).emit('updateComponent', {
            status: EGameServerStates.ENDGAME,
            room: room,
          });
        } else if (
          room.roomStatus === ERoomStates.Ended ||
          room.roomStatus === ERoomStates.Closed
        ) {
          console.log(
            '[GATEWAY - handleDicsonnect]',
            'End game disconnection of the player: ',
            user.nickname,
          );
          this.createMatchHistory(room);
        }
        this.removePlayerFromRoom(user.nickname, room);
        // THE LAST PLAYER DISCONNECTION TRIGGER THE DELETION OF THE SERVER ROOM
        if (room.playerOneId === '0' && room.playerTwoId === '0') {
          this.removeRoom(room.id);
        }
      }
    }

    // DELETE THE USER FROM THE SOCKETS POOL
    this.socketsPool.delete(user.nickname);

    // TODO:
    // HANDLE IN A BETTER WAY THE MODIFICATION OF THE STATUS
    // OR MAKE SURE TO NOT HAVE SIDE EFFECT IF THE USER IS ALREADY PLAYING
    this.userService.updateData(user.nickname, { status: 'Online' });

    // SAFETY PURGE AT EACH DISCONNECTION OF A PLAYER
    this.safetyRoomPurge();

    console.log('[GATEWAY - handleDisconnect]', 'allRooms: ', this.allRooms);
  }

  /***************************************************************************/
  /*** ROOM MANAGEMENT EVENTS ***/
  @SubscribeMessage('initPlayground')
  async initPlayground(@ConnectedSocket() client: Socket, @Body() body) {
    // TODO: ADD A SECURITY ??
    let gameRenderStates = EGameServerStates.HOMEPAGE;
    let roomAssigned: GameDto; // UNDEFINED
    let socketClientRoomId = client.id; // STORE THE SOCKET ID OR THE ROOM TO COMMUNICATE

    console.log('[GATEWAY - initPlayground]', 'body: ', body);

    // Récupération du user connecté à partir du cookie
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    if (!user) {
      console.error('[GATEWAY - initPlayground]', 'USER NOT FOUND');
    }
    const isPlaying = (await this.userService.searchUser(user.nickname)).status;
    console.log('[GATEWAY - initPlayground]', 'isPlaying: ', isPlaying);
    // Si user a le statut "isPlaying", renvoi vers HomePage
    // Cas de reconnexion ou ouverture d'un nouvel onglet
    if (isPlaying === 'Playing') {
      gameRenderStates = EGameServerStates.HOMEPAGE;
    } else {
      // UPDATE THE USER STATUS
      this.userService.updateData(user.nickname, { status: 'Playing' });
      // ADD THE SOCKET USER TO THE SOCKETS POOL
      this.socketsPool.set(user.nickname, client);
      /*** CASE OF RANDOM MATCH FROM HOME OR NAVBAR ***/
      if (body.type === EServerPlayType.RANDOM) {
        console.log('[GATEWAY - initPlayground]', 'Match type: ', body.type);
        gameRenderStates = this.getGameStates(user.nickname);
        console.log(
          '[GATEWAY - initPlayground]',
          'gameRenderStates: ',
          gameRenderStates,
        );
        // CASE OF JOINING A ROOM
        if (gameRenderStates === EGameServerStates.MATCHMAKING) {
          // SAFETY OF PLAYING AGAINST THE SAME PLAYER
          // CHECK IF THE SECOND PLAYER HAS A WAITING ROOM WITH HIS NAME
          const amItheSndPlayer = this.userInRoom(user.nickname);
          // IF THE SECOND PLAYER HAS ALREADY A ROOM OF HIS NAME
          if (amItheSndPlayer) gameRenderStates = EGameServerStates.HOMEPAGE;
          else {
            // IF THE SECOND PLAYER DOES NOT HAVE A ROOM
            // THEN FIND A WAITING ROOM AVAILABLE
            roomAssigned = this.allRooms.find(
              (el) => el.roomStatus === ERoomStates.WaitingOpponent,
            );
            // UPDATE THE ROOM WITH THE SECOND PLAYER INFO
            roomAssigned.players.push(user.nickname);
            roomAssigned.roomStatus = ERoomStates.Busy;
            roomAssigned.isFull = true;
            roomAssigned.playerTwoId = client.id;
            client.join(roomAssigned.id);
            socketClientRoomId = roomAssigned.id;
            console.log(
              '[GATEWAY - initPlayground]',
              'roomAssigned: ',
              roomAssigned,
            );
            gameRenderStates = EGameServerStates.VERSUS;
          }
        }
        console.log(
          '[GATEWAY - initPlayground]',
          'gameRenderStates: ',
          gameRenderStates,
        );
      }
      // CASE OF ONE TO ONE MATCH FROM CHANNEL
      else if (body.type === EServerPlayType.ONETOONE) {
        console.log('[GATEWAY - initPlayground]', 'Match type: ', body.type);
        // CHECK IF BOTH PLAYERS ARE NOT ALREADY IN A ROOM
        // IF ONE ON BOTH === TRUE
        // RESULT ==> EGameServerStates.HOMEPAGE;
        // IF NOT FOR BOTH
        // THEN SENDER --> EGameServerStates.SETTINGS
        // THEN RECEIVER --> EGameServerStates.MATHCMAKING
        const senderRoom = this.userInRoom(body.sender);
        const receiverRoom = this.userInRoom(body.receiver);
        if (senderRoom || receiverRoom) {
          console.error(
            '[GATEWAY - initPlayground]',
            'ONE USER IS ALREADY IN A ROOM',
          );
          gameRenderStates = EGameServerStates.HOMEPAGE;
        } else {
          if (user.nickname === body.sender) {
            gameRenderStates = EGameServerStates.SETTINGS;
          } else {
            gameRenderStates = EGameServerStates.MATCHMAKING;
          }
        }
      } else {
        console.error('[GATEWAY - initPlayground] MATCH TYPE: UNKNOW');
      }
    }
    // EMIT TO EVERY PLAYER INSIDE THE ROOM THEIR STATE TO DISPLAY THE RIGHT COMPONENT
    // AND UPDATE THE ROOM SETTINGS (PLAYING COLOR, SCORES, PLAYERS)
    // CASE OF CREATION OF THE ROOM
    // EMIT TO THE PLAYER THE STATE TO DISPLAY THE SETTINGS COMPONENT
    // ROOM VARIABLE IS EMPTY GAMEDTO
    console.log('[GATEWAY - initPlayground]', 'roomAssigned: ', roomAssigned);
    this.server.to(socketClientRoomId).emit('updateComponent', {
      status: gameRenderStates,
      room: roomAssigned,
    });
  }

  @SubscribeMessage('RequestGameSettings')
  async requestGameSettings(@ConnectedSocket() client: Socket, @Body() body) {
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    console.log(
      '[GATEWAY - RequestGameSettings]',
      'Request game settings by: ',
      user.nickname,
    );
    let roomId = client.id;
    let playType = body.roomInfo.type;
    const room: GameDto = {
      id: user.nickname,
      createdDate: new Date(),
      mapName: 'Default',
      power: false,
      isFull: false,
      players: new Array<string>(),
      playerOneId: client.id,
      playerTwoId: '0',
      scorePlayers: new Array<number>(),
      roomStatus: ERoomStates.WaitingOpponent,
      collided: true,
      totalSet: 1,
      totalPoint: body.points,
      boardColor: body.boardColor,
      netColor: body.netColor,
      scoreColor: body.scoreColor,
      ballColor: body.ballColor,
      paddleColor: body.paddleColor,
    };

    room.players.push(user.nickname);
    room.scorePlayers.push(0);
    room.scorePlayers.push(0);
    this.allRooms.push(room);
    client.join(room.id);
    if (playType === EServerPlayType.ONETOONE) {
      roomId = room.id;
      // TODO: ADD SAFETY CHECK IF THE RECEIVER SOCKETS IS NOT ANYMORE IN THE POOL
      const playerTwoSocket = this.socketsPool.get(body.roomInfo.receiver);
      // SAFETY CHECK WHERE THE RECEIVER HAS ALREADY LEFT THE GAME BEFORE THE END
      // OF THE GAME SETTINGS DEFINITION
      if (!playerTwoSocket) {
        console.error(
          `[GATEWAY - RequestGameSettings] RECEIVER ${body.roomInfo.receiver} HAS LEFT THE GAME BEFORE THE SUBMIT OF GAME SETTINGS`,
        );
        this.server.to(roomId).emit('updateComponent', {
          status: EGameServerStates.HOMEPAGE,
          room: room,
        });
        return;
      }
      console.log(
        '[GATEWAY - RequestGameSettings]',
        'receiverSocket: ',
        playerTwoSocket.id,
      );
      playerTwoSocket.join(roomId);
      room.players.push(body.roomInfo.receiver);
      room.playerTwoId = playerTwoSocket.id;
      room.isFull = true;
      room.roomStatus = ERoomStates.Busy;
    }
    if (playType === EServerPlayType.RANDOM) {
      this.server.to(roomId).emit('updateGameSettings', {
        status: EGameServerStates.MATCHMAKING,
        room: room,
      });
    } else {
      this.server.to(roomId).emit('updateGameSettings', {
        status: EGameServerStates.VERSUS,
        room: room,
      });
    }
  }
  // CHANGE THE CLIENT GAME STATES TO GAMEON WHICH WILL DISPLAY
  // PONG BOARD AND ACTIVATE THE GAME
  // THE EMIT SIGNAL WILL BE ACTIVATED ONLY ONE TIME
  // WHEN ONE OF TWO USER OF THE ROOM WILL SEND THE REQUEST
  // THE SECOND USER WILL BE IGNORED BECAUSE THE STATUS OF THE ROOM SERVER
  // WILL BE GAMEON
  @SubscribeMessage('RequestGameOn')
  async requestGameOn(@ConnectedSocket() client: Socket) {
    // TODO: ADD A SECURITY ??
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    if (!user) {
      console.error('[GATEWAY - RequestGameOn] USER NOT FOUND');
    }
    const room = this.userInRoom(user.nickname); // SHALLOW COPY
    if (room.roomStatus !== ERoomStates.GameOn) {
      this.updateRoomData(room.id, 'roomStatus', ERoomStates.GameOn);
      this.server.to(room.id).emit('updateComponent', {
        status: EGameServerStates.GAMEON,
        room: room,
      });
    }
  }

  @SubscribeMessage('requestEndOfGame')
  async requestEndOfGame(@ConnectedSocket() client: Socket, @Body() body) {
    // TODO: ADD A SECURITY ??
    const user = await this.friendshipGateway.getUserInfoFromSocket(
      client.handshake.headers.cookie,
    );
    if (!user) {
      console.error('[GATEWAY - requestEndOfGame] USER NOT FOUND');
    }
    const room = this.userInRoom(user.nickname); // SHALLOW COPY
    if (room.roomStatus !== ERoomStates.Ended) {
      this.updateRoomData(room.id, 'roomStatus', ERoomStates.Ended);
      // TEMPORARY TEST
      this.updateRoomData(room.id, 'scorePlayers', [2, 0]);
      this.server.to(room.id).emit('updateComponent', {
        status: EGameServerStates.ENDGAME,
        room: room,
      });
    }
  }

  /***************************************************************************/
  /*** ROOM MANAGEMENT UTILS ***/

  getGameStates(userName: string) {
    console.log('[GATEWAY - getGameStates]', 'userName: ', userName);
    const possibleRooms = this.allRooms.filter(
      (el) => el.roomStatus === ERoomStates.WaitingOpponent,
    );
    console.log(
      '[GATEWAY - getGameStates]',
      'All waiting room: ',
      possibleRooms,
    );
    if (possibleRooms.length === 0)
      return EGameServerStates.SETTINGS; // pas de room en attente => création
    else return EGameServerStates.MATCHMAKING; // room en attente d'opponent
  }

  // CHECK IF A USER IS ALREADY IN A ROOM
  userInRoom(userName: string): GameDto | undefined {
    console.log('[GATEWAY - userInRoom]', 'userName: ', userName);
    const room = this.allRooms.find((obj) => obj.players.includes(userName));
    console.log('[GATEWAY - userInRoom] ', 'room: ', room);
    return room;
  }

  // RETURN THE NUMBER OF THE PLAYER IN THE ROOM
  playerNumberInRoom(userName: string, room: GameDto): number {
    console.log(
      '[GATEWAY - playerNumberInRoom]',
      'userName: ',
      userName,
      '| room: ',
      room,
    );
    return room.players[0] === userName ? 0 : 1;
  }

  // FORCE THE SCORE OF A PLAYER WHO HAS LEFT THE GAME (DISCONNECTION OR RAGE QUIT)
  forceScore(userName: string, room: GameDto) {
    if (this.playerNumberInRoom(userName, room) === 0) {
      room.scorePlayers[0] = -42;
    } else {
      room.scorePlayers[1] = -42;
    }
  }

  // REMOVE A PLAYER FROM A ROOM
  removePlayerFromRoom(userName: string, room: GameDto) {
    console.log(
      '[GATEWAY - removePlayerFromRoom]',
      'userName: ',
      userName,
      '| room: ',
      room,
    );
    if (this.playerNumberInRoom(userName, room) === 0) {
      room.playerOneId = '0';
      // DO NOT USE IT BECAUSE SIDE EFFECT IN SOME DISCONNECION CASES
      // room.players = ['', room.players[1]];
    } else {
      room.playerTwoId = '0';
      // DO NOT USE IT BECAUSE SIDE EFFECT IN SOME DISCONNECION CASES
      // room.players = [room.players[0], ''];
    }
    // DO NOT USE IT BECAUSE SIDE EFFECT IN SOME DISCONNECION CASES
    // room.players = room.players.filter((element) => element !== userName);
    console.log('[GATEWAY - removePlayerFromRoom]', 'room: ', room);
  }

  // UPDATE A PROPERTY OF A ROOM
  updateRoomData(roomId: string, data: string, newValue: any) {
    console.log(
      '[GATEWAY - updateRoomData]',
      'roomId: ',
      roomId,
      '| data: ',
      data,
      '| newValue: ',
      newValue,
    );
    this.allRooms.forEach((element) => {
      if (element.id === roomId) {
        element[data] = newValue;
      }
    });
  }

  // CREATE THE MATCH TO THE MATCH HISTORY DATABASE
  createMatchHistory(room: GameDto) {
    console.log('[GATEWAY - createMatchHistory]', 'room: ', room);
    if (room.roomStatus !== ERoomStates.Closed) {
      this.gameService.matchCreation(room);
      room.roomStatus = ERoomStates.Closed;
    } else {
      console.log(
        '[GATEWAY - createMatchHistory]',
        'The match has already been created',
      );
    }
  }

  // REMOVE A ROOM FROM THE SERVER
  removeRoom(roomId: string) {
    console.log('[GATEWAY - removeRoom]', 'roomId: ', roomId);
    this.allRooms = this.allRooms.filter((element) => element.id !== roomId);
  }

  // FUNCTION TO FILTER THE ROOMS DURING SAFETY PURGE FUNCTION
  purgeCallbackFilter = (element: GameDto): boolean => {
    console.log('[GATEWAY - purgeCallbackFilter]', 'element: ', element);
    if (
      element.isFull === false &&
      element.playerOneId === '0' &&
      element.playerTwoId === '0' &&
      element.roomStatus === ERoomStates.Closed
    ) {
      console.log('[GATEWAY - purgeCallbackFilter]', 'false');
      return false; // false === MUST BE DELETED
    }
    console.log('[GATEWAY - purgeCallbackFilter]', 'true');
    return true; // true === MUST BE KEPT
  };

  // SAFETY PURGE ROOM ACCORDING TO EXISTING SOCKETS IN SOCKETS POOL
  // DELETE EVERY ROOM WHEN EACH PLAYERS ARE NOT PRESENT ANYMORE IN
  // THE SOCKETS POOL
  safetyRoomPurge() {
    console.log('[GATEWAY - safetyRoomPurge]');
    this.allRooms.forEach((element) => {
      if (
        !this.socketsPool.get(element.players[0]) &&
        !this.socketsPool.get(element.players[1])
      ) {
        console.log(
          '[GATEWAY - safetyRoomPurge]',
          'ERROR ABOUT PLAYERS IN THE ROOM: ',
          element,
        );
        element.isFull = false;
        element.playerOneId = '0';
        element.playerTwoId = '0';
        element.players = [];
        element.roomStatus = ERoomStates.Closed;
      }
    });
    this.allRooms = this.allRooms.filter(this.purgeCallbackFilter);
  }

  /***************************************************************************/
  /*** GAME EVENTS ***/
  @SubscribeMessage('requestMovePaddle')
  async handleRequestMovePaddle(client: Socket, value: number): Promise<void> {
    const [socketId, roomName] = [...client.rooms];
    const room = this.allRooms.find((el) => el.id === roomName);
    const player =
      room.playerOneId === socketId ? room.playerOneId : room.playerTwoId;
    this.server.to(roomName).emit('updateMovePaddle', { player, value });
  }

  /***************************************************************************/
  /*** OLD PONG VERSION ***/
  @SubscribeMessage('requestMoveBall')
  async handleRequestMoveBall(
    client: Socket,
    value: { positions: Array<number>; velocity: Array<number> },
  ): Promise<void> {
    // console.log('rooms ', client.rooms);
    const [socketId, roomName] = [...client.rooms];
    // console.log(`socket id ${socketId} in the room ${roomName}`);
    this.server.to(roomName).emit('updateMoveBall', value);
  }

  @SubscribeMessage('requestAfterPaddleCollision')
  async handlerequestAfterPaddleCollisionl(
    client: Socket,
    value: {
      positions: Array<number>;
      velocity: Array<number>;
      canBeCollided: boolean;
    },
  ): Promise<void> {
    // console.log('value ', value);
    const [socketId, roomName] = [...client.rooms];
    // console.log(`socket id ${socketId} in the room ${roomName}`);
    this.server.to(roomName).emit('updateAfterPaddleCollision', value);
  }

  @SubscribeMessage('requestResetPositionBall')
  async handleRequestResetPositionBall(
    client: Socket,
    value: { positions: Array<number>; canBeCollided: boolean },
  ): Promise<void> {
    // console.log('rooms ', client.rooms);
    const [socketId, roomName] = [...client.rooms];
    // console.log(`socket id ${socketId} in the room ${roomName}`);
    this.server.to(roomName).emit('updatePositionBall', value);
  }

  @SubscribeMessage('requestResetPositionPlayer')
  async handleRequestResetPositionPlayer(
    client: Socket,
    value: { player1Position: Array<number>; player2Position: Array<number> },
  ): Promise<void> {
    // console.log('rooms ', client.rooms);
    const [socketId, roomName] = [...client.rooms];
    // console.log(`socket id ${socketId} in the room ${roomName}`);
    this.server.to(roomName).emit('updatePositionPlayer', value);
  }

  @SubscribeMessage('requestPlayerScore')
  async handleRequestPlayerScore(client: Socket, value: string): Promise<void> {
    // console.log('rooms ', client.rooms);
    const [socketId, roomName] = [...client.rooms];
    const room = this.allRooms.find((el) => el.id === roomName);
    if (value === socketId) {
      room.scorePlayers[0] += 1;
    } else room.scorePlayers[1] += 1;
    // console.log(`socket id ${socketId} in the room ${roomName}`);
    this.server.to(roomName).emit('updatePlayerScore', room.scorePlayers);
  }
}