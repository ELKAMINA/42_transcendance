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

export class MatchDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsDate()
  createdDate: Date;

  @IsNotEmpty()
  @IsInt()
  totalSet: Number;

  @IsNotEmpty()
  @IsInt()
  totalPoint: Number;

  @IsNotEmpty()
  @IsString()
  mapName: string;

  @IsNotEmpty()
  @IsBoolean()
  power: boolean;

  @IsArray()
  @ArrayMaxSize(2)
  players: UserDetails[];
}
