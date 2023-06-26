import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UserDetails } from "src/user/types";

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	login: string;
  
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
	@ApiProperty()
	avatar: string;

	// @IsNotEmpty()
	// @ApiProperty()
	// chatHistory: ChatElement[];
  }