import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { UserWithTime } from "../channel.controller";

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqBannedDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	channelName: ChannelNameObj;

	@IsArray()
	banned: UserWithTime[];
}