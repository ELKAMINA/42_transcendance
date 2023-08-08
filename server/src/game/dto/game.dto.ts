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
}
