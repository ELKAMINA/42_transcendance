import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { channelController } from './channel.controller';
import { MuteSchedulerService } from './MuteSchedulerService';
import { BannedSchedulerService } from './BannedSchedulerService';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  providers: [
    ChannelService,
    MuteSchedulerService,
    BannedSchedulerService,
    UserService,
  ],
  controllers: [channelController],
})
export default class channelModule {}
export class MuteSchedulerModule {}
export class BannedSchedulerModule {}
