import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsDate, IsBoolean, MaxLength } from "class-validator";

export class MessageDto {

	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	sentBy: string;
  
	@IsString()
	@ApiProperty()
	@MaxLength(64)
	message: string;

	@IsDate()
	@IsNotEmpty()
	@ApiProperty()
	sentAt: Date;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	img: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	preview: string;

	@IsBoolean()
	@ApiProperty()
	incoming: boolean

	@IsBoolean()
	@ApiProperty()
	outgoing: boolean

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	subtype: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	reply: string;

	@IsNotEmpty()
	@ApiProperty()
	channel: string;
  }