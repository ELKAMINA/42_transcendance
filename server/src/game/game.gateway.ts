import { Injectable, Body } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { GameService } from './game.service';
import { GameDto } from './dto/game.dto';
import { BoardDto } from './dto/board.dto';
import { BallDto } from './dto/ball.dto';
import { PlayerDto } from './dto/player.dto';
import {
  EServerPlayType,
  EGameServerStates,
  ERoomStates,
} from './enum/EServerGame';

import { SchedulerRegistry } from '@nestjs/schedule';

@WebSocketGateway(4010, { cors: '*' })
@Injectable()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private gameService: GameService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @WebSocketServer() server: Server;

  // CONTAINS EVERY CREATED GAME ROOM
  private allRooms: Array<GameDto> = new Array<GameDto>();

  // CONTAINS EVERY CONNECTED SOCKETS USER
  private socketsPool: Map<string, Socket> = new Map<string, Socket>();

  /***************************************************************************/
  /*** USER CONNNECTION EVENTS ***/
  async handleConnection(client: Socket) {
    // SAFETY
    const user = await this.getUserInfoFromSocket(client);
    if (!user) {
      console.error('[GATEWAY - handleConnection] USER NOT FOUND');
      return;
    }
    // console.log('[GATEWAY - handleConnection]', 'user: ', user);
    const userSocket = this.socketsPool.get(user.nickname);
    if (userSocket && client.id !== userSocket.id) {
      console.error(
        '[GATEWAY - handleConnection]',
        'The user has already a socket in the sockets pool: ',
        user.nickname,
      );
    } else {
      this.socketsPool.set(user.nickname, client);
    }
  }

  async handleDisconnect(client: Socket) {
    let room: GameDto = undefined;
    const user = await this.getUserInfoFromSocket(client);
    if (!user) {
      console.error('[GATEWAY - handleDisconnect] USER NOT FOUND');
      return;
    }
    // console.log('[GATEWAY - handleDisconnect]', 'user: ', user);
    const userSocket = this.socketsPool.get(user.nickname);
    if (userSocket && client.id !== userSocket.id) {
      console.error(
        '[GATEWAY - handleDisconnect]',
        'The user has already a socket in the sockets pool: ',
        user.nickname,
      );
      return;
    }
    room = this.userInRoom(user.nickname);
    if (!room) {
      // console.log(
      //   '[GATEWAY - handleDisconnect]',
      //   'The player is not linked to a room (leaving settings screen or else): ',
      //   user.nickname,
      // );
    } else {
      // DELETE THE ROOM OF THE USER IF HE IS THE OWNER AND ALONE IN THE ROOM (WAITING)
      // USE CASE:
      // - PLAYER TYPE RANDOM AND NO OPPONENT IS COMING TO THE ROOM
      // - PLAYER TYPE ONE TO NONE BUT THE OPPONENT HAS LEFT THE ROOM BEFORE THE END OF GAME SETTINGS
      if (
        room.owner === user.nickname &&
        room.isFull === false &&
        room.roomStatus === ERoomStates.WaitingOpponent
      ) {
        // console.log(
        //   '[GATEWAY - handleDisconnect]',
        //   'The player has left the game during the waiting opponent: ',
        //   user.nickname,
        // );
        this.removeRoom(room.id);
      }
      // USE CASES:
      // - DISCONNECTION OF ONE OF BOTH PLAYERS IN VERSUS SCREEN
      // - RAGEQUIT
      // - ENDGAME (FIRST DISCONNECTION OF A PLAYER)
      else if (room.isFull === true) {
        // DISCONNECTION OF ONE OF BOTH PLAYERS IN VERSUS SCREEN
        if (room.roomStatus === ERoomStates.Busy) {
          //   console.warn(
          //     '[GATEWAY - handleDisconnect]',
          //     'The player has left the game during versus screen: ',
          //     user.nickname,
          //   );
          this.server.to(room.id).emit('updateComponent', {
            status: EGameServerStates.HOMEPAGE,
            room: room,
          });
        } else if (room.roomStatus === ERoomStates.GameOn) {
          // RAGE QUIT / DISCONNECTION OF ONE OF BOTH PLAYERS DURING A GAME
          // FORCE THE SCORE OF THE ROOM ACCORDING TO THE PLAYER WHO
          // HAS LEFT THE ROOM
          //   console.warn(
          //     '[GATEWAY - handleDisconnect]',
          //     'The player has left the game (disconnection or rage quit): ',
          //     user.nickname,
          //   );
          // STOP THE UPDATE INTERVAL DURING THE GAME
          if (room.interval) {
            clearInterval(room.interval);
            room.interval = null;
          }
          // STOP THE RENDER INTERVAL DURING THE GAME
          this.server.to(room.id).emit('endGame');
          // FORCE THE SCORE TO PUNISH THE PLAYER WHO HAS LEFT THE GAME
          this.forceScore(user.nickname, room);
          // CREATE THE MATCH HISTORY
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
          // console.log(
          //   '[GATEWAY - handleDicsonnect]',
          //   'End game disconnection of the player: ',
          //   user.nickname,
          // );
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

    this.userService.updateData(user.nickname, { status: 'Online' });

    // SAFETY PURGE AT EACH DISCONNECTION OF A PLAYER
    this.safetyRoomPurge();

    // console.log('[GATEWAY - handleDisconnect]', 'allRooms: ', this.allRooms);
  }

  /***************************************************************************/
  /*** ROOM EVENTS ***/
  @SubscribeMessage('initPlayground')
  async initPlayground(@ConnectedSocket() client: Socket, @Body() body) {
    let gameRenderStates = EGameServerStates.HOMEPAGE;
    let roomAssigned: GameDto; // UNDEFINED
    let socketClientRoomId = client.id; // STORE THE SOCKET ID OR THE ROOM TO COMMUNICATE

    // console.log('[GATEWAY - initPlayground]', 'body: ', body);

    // Récupération du user connecté à partir du cookie
    const user = await this.getUserInfoFromSocket(client);
    if (!user) {
      console.error('[GATEWAY - initPlayground]', 'USER NOT FOUND');
      this.server.to(socketClientRoomId).emit('updateComponent', {
        status: gameRenderStates,
        room: roomAssigned,
      });
      return;
    }
    const isPlaying = (await this.userService.searchUser(user.nickname)).status;
    // console.log('[GATEWAY - initPlayground]', 'isPlaying: ', isPlaying);
    // Si user a le statut "isPlaying", renvoi vers HomePage
    // Cas de reconnexion ou ouverture d'un nouvel onglet
    if (isPlaying === 'Playing') {
      gameRenderStates = EGameServerStates.HOMEPAGE;
    } else {
      // UPDATE THE USER STATUS
      this.userService.updateData(user.nickname, { status: 'Playing' });
      // ADD THE SOCKET USER TO THE SOCKETS POOL
      // this.socketsPool.set(user.nickname, client);
      /*** CASE OF RANDOM MATCH FROM HOME OR NAVBAR ***/
      if (body.type === EServerPlayType.RANDOM) {
        // console.log('[GATEWAY - initPlayground]', 'Match type: ', body.type);
        gameRenderStates = this.getGameStates(user.nickname);
        // console.log(
        //   '[GATEWAY - initPlayground]',
        //   'gameRenderStates: ',
        //   gameRenderStates,
        // );
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
            // console.log(
            //   '[GATEWAY - initPlayground]',
            //   'roomAssigned: ',
            //   roomAssigned,
            // );
            gameRenderStates = EGameServerStates.VERSUS;
          }
        }
        // console.log(
        //   '[GATEWAY - initPlayground]',
        //   'gameRenderStates: ',
        //   gameRenderStates,
        // );
      }
      // CASE OF ONE TO ONE MATCH FROM CHANNEL
      else if (body.type === EServerPlayType.ONETOONE) {
        // console.log('[GATEWAY - initPlayground]', 'Match type: ', body.type);
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
    // console.log('[GATEWAY - initPlayground]', 'roomAssigned: ', roomAssigned);
    this.server.to(socketClientRoomId).emit('updateComponent', {
      status: gameRenderStates,
      room: roomAssigned,
    });
  }

  @SubscribeMessage('RequestGameSettings')
  async requestGameSettings(@ConnectedSocket() client: Socket, @Body() body) {
    const user = await this.getUserInfoFromSocket(client);
    if (!user) {
      console.error('[GATEWAY - RequestGameSettings]', 'USER NOT FOUND');
      this.server.to(client.id).emit('updateComponent', {
        status: EGameServerStates.HOMEPAGE,
        room: undefined,
      });
      return;
    }
    // console.log(
    //   '[GATEWAY - RequestGameSettings]',
    //   'Request game settings by: ',
    //   user.nickname,
    // );
    let roomId = client.id;
    const playType = body.roomInfo.type;
    const now = new Date();
    const room: GameDto = {
      id: user.nickname + '_' + now,
      owner: user.nickname,
      createdDate: now,
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
      board: new BoardDto(800, 600),
      ball: new BallDto(),
      player1: new PlayerDto(),
      player2: new PlayerDto(),
      frameTime: 1000 / 50,
      interval: null,
      ballSpeed: 5,
      ballVelocity: [4, 4],
      paddleSpeed: 20,
      paddleHeight: 100,
    };

    room.players.push(user.nickname);
    room.scorePlayers.push(0);
    room.scorePlayers.push(0);
    this.allRooms.push(room);
    client.join(room.id);
    if (playType === EServerPlayType.ONETOONE) {
      roomId = room.id;
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
      // console.log(
      //   '[GATEWAY - RequestGameSettings]',
      //   'receiverSocket: ',
      //   playerTwoSocket.id,
      // );
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
    // console.log('[GATEWAY - RequestGameSettings]', 'room: ', room);
  }

  // CHANGE THE CLIENT GAME STATES TO GAMEON WHICH WILL DISPLAY
  // PONG BOARD AND ACTIVATE THE GAME
  // THE EMIT SIGNAL WILL BE ACTIVATED ONLY ONE TIME
  // WHEN ONE OF TWO USER OF THE ROOM WILL SEND THE REQUEST
  // THE SECOND USER WILL BE IGNORED BECAUSE THE STATUS OF THE ROOM SERVER
  // WILL BE GAMEON
  @SubscribeMessage('RequestGameOn')
  async requestGameOn(@ConnectedSocket() client: Socket) {
    // SAFETY
    const user = await this.getUserInfoFromSocket(client);
    if (!user) {
      console.error('[GATEWAY - requestGameOn]', 'USER NOT FOUND');
      this.server.to(client.id).emit('updateComponent', {
        status: EGameServerStates.HOMEPAGE,
        room: undefined,
      });
      return;
    }
    const room = this.userInRoom(user.nickname); // SHALLOW COPY
    // SAFETY
    if (!room) {
      this.server.to(client.id).emit('updateComponent', {
        status: EGameServerStates.HOMEPAGE,
        room: room,
      });
    }
    if (room.roomStatus !== ERoomStates.GameOn) {
      this.updateRoomData(room.id, 'roomStatus', ERoomStates.GameOn);
      this.server.to(room.id).emit('updateComponent', {
        status: EGameServerStates.GAMEON,
        room: room,
      });
      this.initGame(room);
    }
  }

  /***************************************************************************/
  /*** ROOM UTILS ***/
  // RETURN THE USER INFO FROM THE COOKIE OR FROM THE SOCKETS POOL
  // IF THERE IS AN ISSUE WITH THE COOKIE AND/OR COOKIE CONTENT
  getUserInfoFromSocket(client: Socket) {
    const cookie = client.handshake.headers.cookie;
    let idAtRt: any = undefined;

    if (cookie) {
      const { Authcookie: userInfo } = parse(cookie);
      idAtRt = JSON.parse(userInfo);
      if (idAtRt) {
        return idAtRt;
      }
    }
    console.error(
      '[GATEWAY - getUserInfoFromSocket]',
      'cookie OR idAtRt UNDEFINED',
    );
    idAtRt = {
      nickname: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      avatar: undefined,
    };
    this.socketsPool.forEach((element, key) => {
      if (element.id === client.id) {
        idAtRt.nickname = key;
        // console.log(
        //   '[GATEWAY - getUserInfoFromSocket]',
        //   'Client found in socketsPool: ',
        //   idAtRt.nickname,
        // );
      }
    });
    if (idAtRt.nickname) {
      return idAtRt;
    }
    return undefined;
  }

  // RETURN A RENDER STATE ACCORDING TO AVAILABLE WAITING ROOM
  getGameStates(userName: string): EGameServerStates {
    // console.log('[GATEWAY - getGameStates]', 'userName: ', userName);
    const possibleRooms = this.allRooms.filter(
      (el) => el.roomStatus === ERoomStates.WaitingOpponent,
    );
    // console.log(
    //   '[GATEWAY - getGameStates]',
    //   'All waiting room: ',
    //   possibleRooms,
    // );
    if (possibleRooms.length === 0)
      return EGameServerStates.SETTINGS; // pas de room en attente => création
    else return EGameServerStates.MATCHMAKING; // room en attente d'opponent
  }

  // CHECK IF A USER IS ALREADY IN A ROOM
  userInRoom(userName: string): GameDto | undefined {
    // console.log('[GATEWAY - userInRoom]', 'userName: ', userName);
    // const room = this.allRooms.find((obj) => obj.players.includes(userName));
    // console.log('[GATEWAY - userInRoom] ', 'room: ', room);
    // return room;
    let room: GameDto = undefined;
    this.allRooms.forEach((element) => {
      if (element.players.includes(userName)) {
        const playerIdNumber = this.playerNumberInRoom(userName, element);
        // console.log(
        //   '[GATEWAY - userInRoom]',
        //   'playerIdNumber: ',
        //   playerIdNumber,
        // );
        if (
          (playerIdNumber === 0 && element.playerOneId !== '0') ||
          (playerIdNumber === 1 && element.playerTwoId !== '0')
        ) {
          // console.log('[GATEWAY - userInRoom] ', 'element: ', element);
          room = element;
        }
      }
    });
    // console.log('[GATEWAY - userInRoom]', 'room: ', room);
    return room;
  }

  // RETURN THE NUMBER OF THE PLAYER IN THE ROOM
  playerNumberInRoom(userName: string, room: GameDto): number {
    // console.log(
    //   '[GATEWAY - playerNumberInRoom]',
    //   'userName: ',
    //   userName,
    //   '| room: ',
    //   room,
    // );
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
    // console.log(
    //   '[GATEWAY - removePlayerFromRoom]',
    //   'userName: ',
    //   userName,
    //   '| room: ',
    //   room,
    // );
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
    // console.log('[GATEWAY - removePlayerFromRoom]', 'room: ', room);
  }

  // UPDATE A PROPERTY OF A ROOM
  updateRoomData(roomId: string, data: string, newValue: any) {
    // console.log(
    //   '[GATEWAY - updateRoomData]',
    //   'roomId: ',
    //   roomId,
    //   '| data: ',
    //   data,
    //   '| newValue: ',
    //   newValue,
    // );
    this.allRooms.forEach((element) => {
      if (element.id === roomId) {
        element[data] = newValue;
      }
    });
  }

  // CREATE THE MATCH TO THE MATCH HISTORY DATABASE
  createMatchHistory(room: GameDto) {
    // console.log('[GATEWAY - createMatchHistory]', 'room: ', room);
    if (room.roomStatus !== ERoomStates.Closed) {
      this.gameService.matchCreation(room);
      room.roomStatus = ERoomStates.Closed;
    } else {
      // console.log(
      //   '[GATEWAY - createMatchHistory]',
      //   'The match has already been created',
      // );
    }
  }

  // REMOVE A ROOM FROM THE SERVER
  removeRoom(roomId: string) {
    // console.log('[GATEWAY - removeRoom]', 'roomId: ', roomId);
    this.allRooms = this.allRooms.filter((element) => element.id !== roomId);
  }

  // FUNCTION TO FILTER THE ROOMS DURING SAFETY PURGE FUNCTION
  purgeCallbackFilter = (element: GameDto): boolean => {
    // console.log('[GATEWAY - purgeCallbackFilter]', 'element: ', element);
    if (
      element.isFull === false &&
      element.playerOneId === '0' &&
      element.playerTwoId === '0' &&
      element.roomStatus === ERoomStates.Closed
    ) {
      // console.log('[GATEWAY - purgeCallbackFilter]', 'false');
      return false; // false === MUST BE DELETED
    }
    // console.log('[GATEWAY - purgeCallbackFilter]', 'true');
    return true; // true === MUST BE KEPT
  };

  // SAFETY PURGE ROOM ACCORDING TO EXISTING SOCKETS IN SOCKETS POOL
  // DELETE EVERY ROOM WHEN EACH PLAYERS ARE NOT PRESENT ANYMORE IN
  // THE SOCKETS POOL
  safetyRoomPurge() {
    // console.log('[GATEWAY - safetyRoomPurge]');
    this.allRooms.forEach((element) => {
      if (
        !this.socketsPool.get(element.players[0]) &&
        !this.socketsPool.get(element.players[1])
      ) {
        // console.log(
        //   '[GATEWAY - safetyRoomPurge]',
        //   'ERROR ABOUT PLAYERS IN THE ROOM: ',
        //   element,
        // );
        element.isFull = false;
        element.playerOneId = '0';
        element.playerTwoId = '0';
        element.players = [];
        element.roomStatus = ERoomStates.Closed;
        if (element.interval) {
          clearInterval(element.interval);
          element.interval = null;
        }
      }
    });
    this.allRooms = this.allRooms.filter(this.purgeCallbackFilter);
  }

  /***************************************************************************/
  /*** GAME MANAGEMENT ***/
  // INIT THE GAME
  async initGame(room: GameDto) {
    const player1Name = room.players[0];
    const player2Name = room.players[1];
    const player1Socket = this.socketsPool.get(player1Name);
    const player2Socket = this.socketsPool.get(player2Name);
    const board = room.board;
    const ball = room.ball;
    const player1 = room.player1;
    const player2 = room.player2;

    // console.log('[GATEWAY - initGame]', 'Start');
    /*** SAFTEY CASES ***/
    if (!player1Socket || !player2Socket) {
      console.error('[GATEWAY - initGame]', 'PLAYER SOCKET NOT FOUND');
      room.roomStatus = ERoomStates.Busy;
      this.server.to(room.id).emit('updateComponent', {
        status: EGameServerStates.HOMEPAGE,
        room: room,
      });
      return;
    }

    /*** GAME FUNCTIONS ***/
    // UPDATE THE SCORE
    const updateScore = (ballX: number) => {
      if (ballX <= 0 + ball.radius) {
        room.scorePlayers[1] += 1;
        // console.log(
        //   '[GATEWAY - updateScore]',
        //   'room: ',
        //   room.id,
        //   'Player TWO has scored',
        // );
      } else if (ballX >= board.width - ball.radius) {
        room.scorePlayers[0] += 1;
        // console.log(
        //   '[GATEWAY - updateScore]',
        //   'room: ',
        //   room.id,
        //   'Player ONE has scored',
        // );
      }
      this.server.to(room.id).emit('updatePlayerScore', room.scorePlayers);
    };

    // RESET THE BALL POSITION ACCORDING TO THE BOARD DIMENSION
    const resetBallPosition = () => {
      ball.position = [board.width / 2, board.height / 2];
      this.server.to(room.id).emit('updatePositionBall', {
        positions: ball.position,
        canBeCollided: true,
      });
    };

    // RESET THE BALL SPEED
    const resetBallSpeed = () => {
      const tmpBallVelocity = [...room.ballVelocity];

      if (ball.velocity[0] <= 0) {
        tmpBallVelocity[0] = -tmpBallVelocity[0];
      }
      ball.speed = room.ballSpeed;
      ball.velocity = [...tmpBallVelocity];
      // console.log(
      //   '[Game GATEWAY - resetBallSpeed]',
      //   'ball.speed: ',
      //   ball.speed,
      //   'ball.velocity: ',
      //   ball.velocity,
      // );
      this.server.to(room.id).emit('updateSpeedBall', {
        speed: ball.speed,
        velocity: ball.velocity,
      });
    };

    // RESET EVERY PADDLE PLAYER POSITION ACCORDING TO THE BOARD DIMENSION
    // AND THE PADDLE POSITION
    const resetPlayer = () => {
      player1.position = [
        10,
        (3 * board.height) / 6 - player1.dimension[1] / 2,
      ];
      player2.position = [
        board.width - 10 - player2.dimension[0],
        (3 * board.height) / 6 - player2.dimension[1] / 2,
      ];
      this.server.to(room.id).emit('updatePositionPlayer', {
        player1Position: player1.position,
        player2Position: player2.position,
      });
    };

    // CHECK THE BALL POSITION ACCORDING TO ITS POSITION IN THE BOARD
    const checkBall = () => {
      const [ballX, ballY] = ball.position;

      // DO NOTHING IF THE BALL IS STILL IN THE BOARD
      if (ballX > 0 + ball.radius && ballX < board.width - ball.radius) {
        return;
      }
      //   console.warn(
      //     '[GATEWAY - resetBall]',
      //     'room: ',
      //     room.id,
      //     'Someone has scored',
      //     'BallX: ',
      //     ballX,
      //   );
      // ball.velocity[0] = -ball.velocity[0];
      resetBallSpeed();
      resetBallPosition();
      resetPlayer();
      updateScore(ballX);
    };

    const borderCollision = () => {
      ball.position[0] = ball.position[0] + ball.velocity[0];
      ball.position[1] = ball.position[1] + ball.velocity[1];
      // CHECK IF THE BALL COLLIDES WITH THE TOP OR THE BOTTOM OF THE CANVAS
      if (
        ball.position[1] - ball.radius <= 0 ||
        ball.position[1] + ball.radius >= board.height
      ) {
        ball.velocity[1] = -ball.velocity[1];
      }
      // EMIT THE BALL MOVEMENT
      this.server.to(room.id).emit('updateMoveBall', {
        positions: ball.position,
        velocity: ball.velocity,
      });
    };

    const paddleCollision = (player: PlayerDto): boolean => {
      // PLAYER SHAPES
      player.top = player.position[1];
      player.bottom = player.position[1] + player.dimension[1];
      player.left = player.position[0];
      player.right = player.position[0] + player.dimension[0];
      // BALL SHAPES
      const radius = ball.radius;
      ball.top = ball.position[1] - radius;
      ball.bottom = ball.position[1] + radius;
      ball.left = ball.position[0] - radius;
      ball.right = ball.position[0] + radius;

      return (
        player.top < ball.bottom &&
        player.bottom > ball.top &&
        player.left < ball.right &&
        player.right > ball.left
      );
    };

    const ballRepositioning = (player: PlayerDto) => {
      let collidePoint: number;
      // GET THE COLLIDE POINT ACCORDING TO THE ORIGIN OF THE PADDLE
      // 0 --> HEIGHT OF THE PADDLE
      collidePoint =
        ball.position[1] - (player.position[1] + player.dimension[1] / 2);
      // VIRTUAL ORIGIN
      // GET THE COLLIDE POINT ACCORDING TO THE VIRTUAL ORIGIN OF THE PADDLE WHICH
      // IS THE HEIGHT OF THE PADDLE / 2
      // collidePoint = collidePoint - player.getPaddleDimensionY() / 2;
      // NORMALIZE THE COLLIDE POINT BETWEEN [-1 --> 0] and [0 --> 1]
      // THIS VALUE WILL BE USED FOR THE COSINUS AND SINUS CALCULATION
      collidePoint = collidePoint / player.dimension[1] / 2;

      const angleRadian = (Math.PI / 4) * collidePoint;
      const direction = ball.position[0] < board.width / 2 ? 1 : -1;
      ball.speed++;
      ball.velocity[0] = Math.cos(angleRadian) * direction * ball.speed;
      ball.velocity[1] = Math.sin(angleRadian) * ball.speed;
      if (ball.canCollide === false) {
        // console.log("Ball can not collide anymore with a player paddle");
        return;
      }
      ball.canCollide = false;
      // EMIT THE BALL MOVEMENT
      this.server.to(room.id).emit('updateAfterPaddleCollision', {
        positions: ball.position,
        velocity: ball.velocity,
        speed: ball.speed,
        canBeCollided: false,
      });
    };

    const updateBall = () => {
      let player: PlayerDto;
      if (ball.position[0] < board.width / 2) {
        // console.warn(
        //   '[GATEWAY - updateBall]',
        //   'room: ',
        //   room.id,
        //   'Side player 1',
        // );
        player = player1;
      } else {
        // console.warn(
        //   '[GATEWAY - updateBall]',
        //   'room: ',
        //   room.id,
        //   'Side player 2',
        // );
        player = player2;
      }
      if (paddleCollision(player)) {
        // console.warn(
        //   '[GATEWAY - updateBall]',
        //   'room: ',
        //   room.id,
        //   'Collision detected',
        // );
        ballRepositioning(player);
      } else if (
        ball.position[0] > (1 * board.width) / 4 &&
        ball.position[0] < (3 * board.width) / 4
      ) {
        ball.canCollide = true;
      }
    };

    /*** DEFAULT GAME OBJECT PROPERTIES ***/
    player1.info = [player1Socket.id, player1Name];
    player2.info = [player2Socket.id, player2Name];
    resetPlayer();
    resetBallSpeed();
    resetBallPosition();

    /*** THE GAME ***/
    const theGame = () => {
      // console.log('[GATEWAY - theGame] DEBUG: ', 'score: ', room.scorePlayers);
      // console.log('[GATEWAY - theGame] DEBUG: ', 'ball: ', ball);
      // console.log('[GATEWAY - theGame] DEBUG: ', 'player1: ', player1);
      // console.log('[GATEWAY - theGame] DEBUG: ', 'player2: ', player2);
      //   console.warn(
      //     `Interval \'${room.id}\' executing at time (${room.frameTime})!`,
      //     'room: ',
      //     room.id,
      //     'board: ',
      //     board,
      //   );
      borderCollision();
      updateBall();
      checkBall();
      if (
        room.scorePlayers[0] >= room.totalPoint ||
        room.scorePlayers[1] >= room.totalPoint
      ) {
        // console.log('[GATEWAY - theGame]', 'room: ', room.id, 'End Game');
        // BOTH SOLUTION WORKS
        // SOLUTION 1
        // this.schedulerRegistry.deleteInterval(room.id);
        // SOLUTION 2
        if (room.interval) {
          clearInterval(room.interval);
          room.interval = null;
        }
        // STOP THE RENDER INTERVAL DURING THE GAME
        this.server.to(room.id).emit('endGame');
        // UPDATE THE ROOM STATE
        room.roomStatus = ERoomStates.Ended;
        this.server.to(room.id).emit('updateComponent', {
          status: EGameServerStates.ENDGAME,
          room: room,
        });
      }
    };
    room.interval = setInterval(theGame, room.frameTime);
    this.schedulerRegistry.addInterval(room.id, room.interval);
  }

  /***************************************************************************/
  /*** GAME EVENTS ***/
  @SubscribeMessage('requestMovePaddle')
  async handleRequestMovePaddle(client: Socket, value: number): Promise<void> {
    const [socketId, roomName] = [...client.rooms];
    const room = this.allRooms.find((el) => el.id === roomName);
    if (room.playerOneId === socketId) {
      room.player1.position[1] = value;
    } else {
      room.player2.position[1] = value;
    }
    this.server.to(roomName).emit('updateMovePaddle', {
      player1Position: room.player1.position,
      player2Position: room.player2.position,
    });
  }
}
