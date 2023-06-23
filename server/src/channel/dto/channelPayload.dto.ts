import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UserDetails } from "src/user/types";
// import { ChatElement } from '../../../../client/src/data/chatHistory'

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	login: string;
  
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	id: number;
  
	@IsString()
	@ApiProperty()
	type: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	owner: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	protected_by_password: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string;

	@IsNotEmpty()
	@ApiProperty()
	userList: UserDetails[];

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	avatar: string;

	// @IsNotEmpty()
	// @ApiProperty()
	// chatHistory: ChatElement[];
  }