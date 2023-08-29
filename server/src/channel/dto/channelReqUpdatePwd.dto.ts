import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqUpdatePwdDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	channelName: ChannelNameObj;

	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	key: string;
}