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

  	@Post('/all')
  	@Public() // TODO - remove public
  	getUserChannels(
	  @Body() nickname): Promise<object> {
		  return this.ChannelService.getUserChannels(nickname);
	}
}
