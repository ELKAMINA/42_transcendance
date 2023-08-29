import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

class ChannelNameObj {
	@IsString()
	name: string;
}

export class ChannelReqPwdDto {
	@IsObject()
	@ValidateNested()
	@Type(() => ChannelNameObj)
	@ApiProperty({ type: ChannelNameObj })
	obj: ChannelNameObj;

	@IsString()
	@ApiProperty()
	pwd: string;
}