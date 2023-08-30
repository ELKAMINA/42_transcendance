import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  maxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // What is that
import { User } from '@prisma/client';

export class turnOnTfaDto {
  @IsNotEmpty()
  @MaxLength(6, { message: 'Invalid code size' })
  @IsString()
  TfaCode;

  @IsOptional()
  actualUser: User;
}

export class checkPwdDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24, { message: 'Invalid nickname length' })
  nickname;

  @IsNotEmpty()
  @IsString()
  password;
}

export class authenticateDTO {
  @IsNotEmpty()
  @MaxLength(6, { message: 'Invalid code size' })
  @IsString()
  TfaCode;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24, { message: 'Invalid nickname length' })
  nickname;
}

export class cancelTfaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24, { message: 'Invalid nickname length' })
  nickname;

  @IsOptional()
  user: User;
}
