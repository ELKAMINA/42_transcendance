import { Body, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';

import { ChannelService } from 'src/channel/channel.service';
import { Channel, User } from '@prisma/client';

@Controller('channel')
@ApiTags('channel')
export class channelController {
  constructor(
    private ChannelService: ChannelService,
    private prismaService: PrismaService,
  ) {}

  @Post('/creation')
  @Public() // TODO - remove public
  createChannel(@Body() dto: ChannelDto): Promise<object> {
	// console.log('dto = ', dto);
    return this.ChannelService.createChannel(dto);
  }

  @Post('/userchannels')
  @Public() // TODO - remove public
  getUserChannels(@Body() requestBody): Promise<object> {
    return this.ChannelService.getUserChannels(requestBody.login);
  }

  @Post('/createdby')
  @Public() // TODO - remove public
  getCreatedByUserChannels(@Body() requestBody): Promise<object> {
    return this.ChannelService.getCreatedByUserChannels(requestBody.login);
  }

  @Post('/ismember')
  @Public() // TODO - remove public
  getUserIsAMemberChannels(@Body() requestBody): Promise<object> {
    return this.ChannelService.getUserIsAMemberChannels(requestBody.login);
  }

  @Post('/all')
  @Public() // TODO - remove public
  getAllChannelsInDatabase(): Promise<object> {
    return this.ChannelService.getAllChannelsInDatabase();
  }

  @Post('/displayed')
  @Public() // TODO - remove public
  getDisplayedChannel(@Body() requestBody): Promise<object> {
    return this.ChannelService.getDisplayedChannel(requestBody.name);
  }

  @Post('/fetchUserPrivateChannels')
  @Public() // TODO - remove public
  getUserPrivateChannels(@Body() requestBody: string): Promise<object> {
    return this.ChannelService.getUserPrivateChannels(requestBody);
  }

  @Post('/fetchUserPublicChannels')
  @Public() // TODO - remove public
  getUserPublicChannels(@Body() requestBody: string): Promise<object> {
    return this.ChannelService.getUserPublicChannels(requestBody);
  }

  @Post('/fetchUserPrivateConvs')
  @Public() // TODO - remove public
  getUserPrivateConvs(@Body() requestBody: string): Promise<object> {
    return this.ChannelService.getUserPrivateConvs(requestBody);
  }

  @Post('/fetchPrivateChannels')
  @Public() // TODO - remove public
  getPrivateChannels(): Promise<object> {
    return this.ChannelService.getAllPrivateChannelsInDatabase();
  }

  @Post('/fetchPublicChannels')
  @Public() // TODO - remove public
  getPublicChannels(): Promise<object> {
    return this.ChannelService.getAllPublicChannelsInDatabase();
  }

  @Post('/fetchPrivateConvs')
  @Public() // TODO - remove public
  getPrivateConvs(): Promise<object> {
    return this.ChannelService.getAllPrivateConvsInDatabase();
  }

  @Post('/deleteChannelByName')
  @Public() // TODO - remove public
  deleteChannelByName(
    @Body() requestBody: { name: string | string[] },
  ): Promise<void> {
    return this.ChannelService.deleteChannelByName(requestBody);
  }

  @Post('/deleteAllChannels')
  @Public() // TODO - remove public
  deleteAllChannels(@Body() requestBody: { createdBy: string }): Promise<void> {
    return this.ChannelService.deleteAllChannels(requestBody);
  }

  @Post('/checkPwd')
  @Public() // TODO - remove public
  checkPwd(
    @Body() requestBody: { pwd: string; obj: { name: string } },
  ): Promise<boolean> {
    return this.ChannelService.checkPwd(requestBody);
  }

  @Post('/updateAdmins')
  @Public() // TODO - remove public
  updateAdmins(
    @Body() requestBody: { channelName: { name: string }; admins: User[] },
  ): Promise<Channel> {
    return this.ChannelService.updateAdmins(requestBody);
  }

  @Post('/addMembers')
  @Public() // TODO - remove public
  addMembers(
    @Body() requestBody: { channelName: { name: string }; members: User[] },
  ): Promise<Channel> {
    return this.ChannelService.addMembers(requestBody);
  }

  @Post('/replaceMembers')
  @Public() // TODO - remove public
  replaceMembers(
    @Body() requestBody: { channelName: { name: string }; members: User[] },
  ): Promise<Channel> {
    return this.ChannelService.replaceMembers(requestBody);
  }

  @Post('/updatePassword')
  @Public() // TODO - remove public
  updatePassword(
    @Body() requestBody: { channelName: { name: string }; key: string },
  ): Promise<Channel> {
    return this.ChannelService.updatePassword(requestBody);
  }
}
