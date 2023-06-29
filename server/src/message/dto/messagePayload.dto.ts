import { ApiProperty } from "@nestjs/swagger";
import { Channel, User } from "@prisma/client";
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateIf, IsDate, IsBoolean } from "class-validator";
// import { UserDetails } from "src/user/types";

export class MessageDto {

	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	sentBy: string;

	@IsNotEmpty()
	@ApiProperty()
	sentTo: Channel;
  
	@IsString()
	@ApiProperty()
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
	channel: Channel;
  }