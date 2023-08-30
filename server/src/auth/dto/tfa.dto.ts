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
