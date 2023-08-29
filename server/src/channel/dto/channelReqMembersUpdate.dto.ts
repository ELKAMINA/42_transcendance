import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString, ValidateNested, isArray, isString } from "class-validator";
import { Type } from 'class-transformer';
import { User } from "@prisma/client";
import { UserModel } from "src/user/types";

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqUpdateMembersDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	channelName: ChannelNameObj;

	@IsArray()
	members: User[];

	@IsString()
	action: string;

	@IsArray()
	tokickOrLeave: UserModel[];
}