import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, IsArray, IsObject, IsString, ValidateNested, isObject } from "class-validator";
import { Type } from 'class-transformer';
import { User } from "@prisma/client";

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqOwnerDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	channelName: ChannelNameObj;

	@IsObject()
	owner: User;
}