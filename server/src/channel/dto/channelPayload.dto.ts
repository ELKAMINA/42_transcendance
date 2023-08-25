import { ApiProperty } from "@nestjs/swagger";
import { Message } from "@prisma/client";
import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateIf, MaxLength, MinLength, IsEmpty, IsIn } from "class-validator";
import { UserByLogin } from "../../user/types";

export class ChannelDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@MinLength(1)
	@ValidateIf((obj) => obj.type !== 'privateConv') // When type is not equal to 'PrivateConv', the @MaxLength(20) validation will be performed on the name property.
    @MaxLength(20, { message: 'Name length should not exceed 20 characters' })
	@ValidateIf((obj) => obj.type === 'privateConv')
  	@MaxLength(50, { message: 'Name length should not exceed 50 characters for privateConv' })
	name: string;
  
	@IsString()
	@ApiProperty()
	@IsIn(['public', 'private', 'privateConv'], { message: 'Type must be public, private, or privateConv' })
	type: string;

	@ApiProperty()
	protected_by_password: boolean;

	@IsString()
	@ApiProperty()
	@ValidateIf((obj) => obj.protected_by_password === true) // if true, the password property will be validated as mandatory using the @IsNotEmpty() decorator. 
	@IsNotEmpty({ message: 'Key must not be empty when protected_by_password is true' })
	@IsEmpty({ message: 'Key must be empty when protected_by_password is false' })
	key: string;

	// @IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	members: UserByLogin[];

	// @IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	admins: UserByLogin[];

	@IsString()
	@ApiProperty()
	@IsOptional()
	avatar: string;

	@ApiProperty()
	// @IsOptional()
	chatHistory: Message[];
  }