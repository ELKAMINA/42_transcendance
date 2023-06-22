import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // What is that

export class FriendshipDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;
}
