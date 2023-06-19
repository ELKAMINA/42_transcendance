import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChannelService } from 'src/channel/channel.service';

@Controller('channel')
@ApiTags('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('/all')
  findAll() {
    return this.channelService.findAll();
  }
}