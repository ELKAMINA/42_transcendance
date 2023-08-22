import { Body, Post, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators';
import { Request } from 'express';
import { parse } from 'cookie';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';

import { ChannelService } from '../channel/channel.service';
import { Channel, User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

type DateTime = Date;

export type UserWithTime = {
  login: string;
  ExpiryTime: string | null;
};

@Controller('channel')
@ApiTags('channel')
// @AuthGuard // AJOUTER PROTECTION
export class channelController {
  constructor(
    private ChannelService: ChannelService,
    private prismaService: PrismaService,
  ) {}

  /* A garder : 
    Check if user is authenticated
  */
  @Post('/creation')
  @Public() // TODO - remove public
  createChannel(
    @Req() request: Request,
    @Body() dto: ChannelDto,
  ): Promise<boolean> {
    const userNickname = this.getUserInfoFromRequest(
      request.headers.cookie,
    ).nickname;
    return this.ChannelService.createChannel(userNickname, dto);
  }

  /* A garder : 
    Check if user is authenticated
  */
  @Post('/userchannels')
  @Public() // TODO - remove public
  getUserChannels(@Body() requestBody): Promise<object> {
    return this.ChannelService.getUserChannels(requestBody.login);
  }
  
  /* A Garder:
    - Checker si le user est bien  membre (et authenticated)
  */
  @Post('/displayed')
  @Public() // TODO - remove public
  getDisplayedChannel(@Body() requestBody): Promise<object> {
    return this.ChannelService.getDisplayedChannel(requestBody.name);
  }

  // @Post('/fetchUserPrivateChannels')
  // @Public() // TODO - remove public
  // getUserPrivateChannels(@Body() requestBody: string): Promise<object> {
  //   return this.ChannelService.getUserPrivateChannels(requestBody);
  // }

  // @Post('/fetchUserPublicChannels')
  // @Public() // TODO - remove public
  // getUserPublicChannels(@Body() requestBody: string): Promise<object> {
  //   return this.ChannelService.getUserPublicChannels(requestBody);
  // }

  // @Post('/fetchUserPrivateConvs')
  // @Public() // TODO - remove public
  // getUserPrivateConvs(@Body() requestBody: string): Promise<object> {
  //   return this.ChannelService.getUserPrivateConvs(requestBody);
  // }

  // @Post('/fetchPrivateChannels')
  // @Public() // TODO - remove public
  // getPrivateChannels(): Promise<object> {
  //   return this.ChannelService.getAllPrivateChannelsInDatabase();
  // }

  /* A Garder:
    - Checker si le user est bien  membre (et authenticated)
  */
  @Post('/fetchPublicChannels')
  @Public() // TODO - remove public
  getPublicChannels(): Promise<object> {
    return this.ChannelService.getAllPublicChannelsInDatabase();
  }

  // @Post('/fetchPrivateConvs')
  // @Public() // TODO - remove public
  // getPrivateConvs(): Promise<object> {
  //   return this.ChannelService.getAllPrivateConvsInDatabase();
  // }

  /* A Garder:
    - Checker si le user est bien  Owner (et authenticated)
  */
  @Post('/deleteChannelByName')
  @Public() // TODO - remove public
  deleteChannelByName(@Body() requestBody: { name: string }): Promise<void> {
    return this.ChannelService.deleteChannelByName(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien membre du channel
  */
  @Post('/checkPwd')
  @Public() // TODO - remove public
  checkPwd(
    @Body() requestBody: { pwd: string; obj: { name: string } },
  ): Promise<boolean> {
    return this.ChannelService.checkPwd(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Admin
  */
  @Post('/updateAdmins')
  @Public() // TODO - remove public
  updateAdmins(
    @Body() requestBody: { channelName: { name: string }; admins: User[] },
  ): Promise<Channel> {
    return this.ChannelService.updateAdmins(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Admin
  */
  @Post('/updateBanned')
  @Public() // TODO - remove public
  updateBanned(
    @Body()
    requestBody: {
      channelName: { name: string };
      banned: UserWithTime[];
    },
  ): Promise<Channel> {
    return this.ChannelService.updateBanned(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Admin
  */
  @Post('/updateMuted')
  @Public() // TODO - remove public
  updateMuted(
    @Body()
    requestBody: {
      channelName: { name: string };
      muted: UserWithTime[];
    },
  ): Promise<Channel> {
    return this.ChannelService.updateMuted(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Owner
  */
  @Post('/updateOwner')
  @Public() // TODO - remove public
  updateOwner(
    @Body() requestBody: { channelName: { name: string }; owner: User },
  ): Promise<Channel> {
    return this.ChannelService.updateOwner(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien membre
  */
  @Post('/addMembers')
  @Public() // TODO - remove public
  addMembers(
    @Body() requestBody: { channelName: { name: string }; members: User[] },
  ): Promise<Channel> {
    return this.ChannelService.addMembers(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Admin
  */
  @Post('/replaceMembers')
  @Public() // TODO - remove public
  replaceMembers(
    @Body()
    requestBody: {
      channelName: { name: string };
      members: User[];
      action: string;
    },
  ): Promise<Channel> {
    return this.ChannelService.replaceMembers(requestBody);
  }

  /* A Garder:
    - Checker si le user est bien Owner
  */
  @Post('/updatePassword')
  @Public() // TODO - remove public
  updatePassword(
    @Body() requestBody: { channelName: { name: string }; key: string },
  ): Promise<Channel> {
    return this.ChannelService.updatePassword(requestBody);
  }

  getUserInfoFromRequest(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }
}
