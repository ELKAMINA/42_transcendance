import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // What is that

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(1)
  @MaxLength(24)
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
  type: string;
}

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  avatar: string;

  @IsOptional()
  type: string;
}
