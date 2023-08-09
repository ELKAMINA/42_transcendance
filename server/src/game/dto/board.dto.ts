import { IsInt, IsNotEmpty } from 'class-validator';

export class BoardDto {
  /*** PROPERTIES **/
  @IsNotEmpty()
  @IsInt()
  width: number;

  @IsNotEmpty()
  @IsInt()
  height: number;
}
