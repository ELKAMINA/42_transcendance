import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateIf, IsDate, IsBoolean } from "class-validator";
// import { UserDetails } from "src/user/types";

export class MessageDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	tyoe: string;
  
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	sentBy: User;
  
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

  }