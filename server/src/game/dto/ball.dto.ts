import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class BallDto {
  /*** PROPERTIES **/
  @IsArray()
  @ArrayMaxSize(2)
  position: number[];

  @IsNotEmpty()
  @IsInt()
  speed: number;

  @IsNotEmpty()
  @IsInt()
  radius: number;

  @IsArray()
  @ArrayMaxSize(2)
  velocity: number[];

  @IsNotEmpty()
  @IsBoolean()
  isVisible: boolean;

  @IsNotEmpty()
  @IsInt()
  top: number;

  @IsNotEmpty()
  @IsInt()
  bottom: number;

  @IsNotEmpty()
  @IsInt()
  left: number;

  @IsNotEmpty()
  @IsInt()
  right: number;

  @IsNotEmpty()
  @IsBoolean()
  canCollide: boolean;
}
