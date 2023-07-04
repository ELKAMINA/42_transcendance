import { Body, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';

import { ChannelService } from 'src/channel/channel.service';

@Controller('channel')
@ApiTags('channel')
export class channelController {
  constructor(private ChannelService: ChannelService, private prismaService: PrismaService) {}

  	@Post('/creation')
	@Public() // TODO - remove public
	createChannel(
		@Body() dto: ChannelDto,): Promise<object> {
			return this.ChannelService.createChannel(dto);
		}

  	@Post('/userchannels')
  	@Public() // TODO - remove public
  	getUserChannels(
		@Body() requestBody: {}): Promise<object> {
			return this.ChannelService.getUserChannels(requestBody);
		}

	@Post('/createdby')
	@Public() // TODO - remove public
	getCreatedByUserChannels(
		@Body() requestBody : {}): Promise<object> {
			return this.ChannelService.getCreatedByUserChannels(requestBody);
		}
	
	@Post('/ismember')
	@Public() // TODO - remove public
	getUserIsAMemberChannels(
		@Body() requestBody : {}): Promise<object> {
	 		return this.ChannelService.getUserIsAMemberChannels(requestBody);
		}

	@Post('/all')
	@Public() // TODO - remove public
	getAllChannelsInDatabase(): Promise<object> {
			return this.ChannelService.getAllChannelsInDatabase();
		}

	@Post('/displayed')
	@Public() // TODO - remove public
	getDisplayedChannel(@Body() requestBody : {}): Promise<object> {
			return this.ChannelService.getDisplayedChannel(requestBody);
		}

	@Post('/deleteChannelByName')
	@Public() // TODO - remove public
	deleteChannelByName(@Body() requestBody : {name : string | string[]}): Promise<void> {
			return this.ChannelService.deleteChannelByName(requestBody);
		}

	@Post('/deleteAllChannels')
	@Public() // TODO - remove public
	deleteAllChannels(): Promise<void> {
			return this.ChannelService.deleteAllChannels();
		}
}
