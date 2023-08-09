import { IsOptional, IsString, ValidateIf, MinLength } from 'class-validator';

export class UserUpdatesDto {
  @IsString()
  @IsOptional()
  oldNick: string;

  @IsString()
  @IsOptional()
  login: string;

  @IsString()
  @MinLength(6)
  @ValidateIf((object) => object.pwd && object.pwd.length > 0)
  pwd: string;

  @IsString()
  @IsOptional()
  atr: string;
}
