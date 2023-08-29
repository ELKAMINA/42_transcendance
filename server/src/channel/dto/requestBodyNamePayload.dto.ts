import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChannelReqNameDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@MinLength(1)
  	@MaxLength(50, { message: 'Name length should not exceed 50 characters for privateConv' })
	name: string;
}