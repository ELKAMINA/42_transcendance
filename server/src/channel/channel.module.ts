import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { channelController } from './channel.controller';
import { MuteSchedulerService } from './MuteSchedulerService';

@Module({
	imports: [], 
	providers: [ChannelService, MuteSchedulerService],
	controllers: [channelController],
})
export default class channelModule {}
export class MuteSchedulerModule {}
