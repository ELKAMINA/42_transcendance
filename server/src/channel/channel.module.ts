import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { channelController } from './channel.controller';

@Module({
	imports: [], 
	providers: [ChannelService],
	controllers: [channelController],
})
export default class channelModule {}
