import { ArrayMaxSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class PlayerDto {
  @IsArray()
  @ArrayMaxSize(2)
  info: string[]; // [socketId, name]

  @IsArray()
  @ArrayMaxSize(2)
  position: number[]; // [x, y]

  @IsNotEmpty()
  @IsInt()
  speed: number;

  @IsArray()
  @ArrayMaxSize(2)
  dimension: number[]; // [width, height]

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

  constructor() {
    this.info = ['', ''];
    this.position = [0, 0];
    this.speed = 20;
    this.dimension = [10, 100];
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
  }
}
