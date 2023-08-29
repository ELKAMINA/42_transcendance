import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { User } from "@prisma/client";

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqAdminsDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	channelName: ChannelNameObj;

	@IsArray()
	admins: User[];
}