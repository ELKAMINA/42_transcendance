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

export class GameDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsDate()
  createdDate: Date;

  @IsNotEmpty()
  @IsInt()
  totalSet: number;

  @IsNotEmpty()
  @IsInt()
  totalPoint: number;

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

  @IsArray()
  @ArrayMaxSize(2)
  scorePlayers: number[];

  @IsString()
  playerOneId: string;

  @IsString()
  playerTwoId: string;

  @IsBoolean()
  collided: boolean;

  roomStatus: ERoomStates;

  @IsBoolean()
  isEndGame: boolean;

  @IsString()
  boardColor: string;

  @IsString()
  ballColor: string;

  @IsString()
  paddleColor: string;

  @IsString()
  netColor: string;
}
