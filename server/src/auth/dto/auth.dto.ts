import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // What is that

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  avatar: string;

  @IsOptional()
  type: string
}
