import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateIf } from "class-validator";
import { UserDetails } from "src/user/types";

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	login: string;
  
	@IsNotEmpty()
	@ApiProperty()
	@IsInt()
	id: number;
  
	@IsString()
	@ApiProperty()
	type: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	owner: string;

	@ApiProperty()
	protected_by_password: boolean;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	// @IsOptional()
	@ValidateIf((obj) => obj.protected_by_password === true) // if true, the password property will be validated as mandatory using the @IsNotEmpty() decorator. 
	password: string;

	// @IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	userList: UserDetails[];

	@IsString()
	@ApiProperty()
	@IsOptional()
	avatar: string;

	// @IsNotEmpty()
	// @ApiProperty()
	// chatHistory: ChatElement[];
  }