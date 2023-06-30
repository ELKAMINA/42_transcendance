import { ApiProperty } from "@nestjs/swagger";
import { Message } from "@prisma/client";
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateIf } from "class-validator";
import { UserDetails } from "src/user/types";

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;
  
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	channelId: number;
  
	@IsString()
	@ApiProperty()
	type: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	createdBy: string;

	@ApiProperty()
	protected_by_password: boolean;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	// @IsOptional()
	@ValidateIf((obj) => obj.protected_by_password === true) // if true, the password property will be validated as mandatory using the @IsNotEmpty() decorator. 
	key: string;

	// @IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	members: UserDetails[];

	@IsString()
	@ApiProperty()
	@IsOptional()
	avatar: string;

	@ApiProperty()
	// @IsOptional()
	chatHistory: Message[];
  }