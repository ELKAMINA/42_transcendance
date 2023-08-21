import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ERoomStates } from '../enum/EServerGame';
import { PlayerDto } from './player.dto';
import { BoardDto } from './board.dto';
import { BallDto } from './ball.dto';

export class GameDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsDate()
  createdDate: Date;

  @IsNotEmpty()
  @IsString()
  mapName: string;

  @IsNotEmpty()
  @IsBoolean()
  power: boolean;

  @IsBoolean()
  isFull: boolean;

  @IsArray()
  @ArrayMaxSize(2)
  players: string[];

  @IsString()
  playerOneId: string;

  @IsString()
  playerTwoId: string;

  @IsArray()
  @ArrayMaxSize(2)
  scorePlayers: number[];

  roomStatus: ERoomStates;

  @IsBoolean()
  collided: boolean;

  // SETTINGS CUSTOMIZATION
  @IsNotEmpty()
  @IsInt()
  totalSet: number;

  @IsNotEmpty()
  @IsInt()
  totalPoint: number;

  @IsString()
  boardColor: string;

  @IsString()
  netColor: string;

  @IsString()
  scoreColor: string;

  @IsString()
  ballColor: string;

  @IsString()
  paddleColor: string;

  // GAME OBJECT
  board: BoardDto;

  ball: BallDto;

  player1: PlayerDto;

  player2: PlayerDto;

  // GAME LOOP
  frameTime: number;

  interval: NodeJS.Timer;

  // DEFAULT GAME OBJECT VALUE
  @IsNotEmpty()
  @IsInt()
  ballSpeed: number;

  @IsArray()
  @ArrayMaxSize(2)
  ballVelocity: number[];

  @IsNotEmpty()
  @IsInt()
  paddleSpeed: number;

  @IsNotEmpty()
  @IsInt()
  paddleHeight: number;
}
