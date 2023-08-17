import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { channelController } from './channel.controller';
import { MuteSchedulerService } from './MuteSchedulerService';
import { BannedSchedulerService } from './BannedSchedulerService';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [],
  providers: [ChannelService, MuteSchedulerService, BannedSchedulerService],
  controllers: [channelController],
})
export default class channelModule {}
export class MuteSchedulerModule {}
export class BannedSchedulerModule {}
