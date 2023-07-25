import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserDetails } from 'src/user/types';

export class gameDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsDate()
  createdDate: number;

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
}
