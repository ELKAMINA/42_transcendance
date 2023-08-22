import { Body, Post, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { Public } from '../decorators';
import { Request } from 'express';
import { parse } from 'cookie';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';

import { Channel, User } from '@prisma/client';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { ChannelService } from '../channel/channel.service';
import { AuthGuard } from '@nestjs/passport';

type DateTime = Date;

export type UserWithTime = {
  login: string;
  ExpiryTime: string | null;
};

@UseGuards(RolesGuard)
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
  getUserChannels(@Body() requestBody): Promise<object> {
    return this.ChannelService.getUserChannels(requestBody.login);
  }

  /* A supprimer/Commenter  */
  // @Post('/createdby')
  // @Public() // TODO - remove public
  // getCreatedByUserChannels(@Body() requestBody): Promise<object> {
  //   return this.ChannelService.getCreatedByUserChannels(requestBody.login);
  // }

  // @Post('/ismember')
  // @Public() // TODO - remove public
  // getUserIsAMemberChannels(@Body() requestBody): Promise<object> {
  //   return this.ChannelService.getUserIsAMemberChannels(requestBody.login);
  // }

  /* A supprimer/Commenter  */
  // @Post('/all')
  // @Public() // TODO - remove public
  // getAllChannelsInDatabase(): Promise<object> {
  //   return this.ChannelService.getAllChannelsInDatabase();
  // }

  /* A Garder:
    - Checker si le user est bien  membre (et authenticated)
  */
  // @Roles('member')
  @Post('/displayed')
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

  @Post('/fetchPublicChannels')
  getPublicChannels(): Promise<object> {
    return this.ChannelService.getAllPublicChannelsInDatabase();
  }

  // @Post('/fetchPrivateConvs')
  // @Public() // TODO - remove public
  // getPrivateConvs(): Promise<object> {
  //   return this.ChannelService.getAllPrivateConvsInDatabase();
  // }

  @Roles('owner')
  @Post('/deleteChannelByName')
  @Public() // TODO - remove public
  deleteChannelByName(@Body() requestBody: { name: string }): Promise<void> {
    return this.ChannelService.deleteChannelByName(requestBody);
  }

  @Roles('member')
  @Post('/checkPwd')
  checkPwd(
    @Body() requestBody: { pwd: string; obj: { name: string } },
  ): Promise<boolean> {
    return this.ChannelService.checkPwd(requestBody);
  }

  @Roles('admin')
  @Post('/updateAdmins')
  updateAdmins(
    @Body() requestBody: { channelName: { name: string }; admins: User[] },
  ): Promise<Channel> {
    return this.ChannelService.updateAdmins(requestBody);
  }

  @Roles('admin')
  @Post('/updateBanned')
  updateBanned(
    @Body()
    requestBody: {
      channelName: { name: string };
      banned: UserWithTime[];
    },
  ): Promise<Channel> {
    return this.ChannelService.updateBanned(requestBody);
  }

  @Roles('admin')
  @Post('/updateMuted')
  updateMuted(
    @Body()
    requestBody: {
      channelName: { name: string };
      muted: UserWithTime[];
    },
  ): Promise<Channel> {
    return this.ChannelService.updateMuted(requestBody);
  }

  @Roles('owner')
  @Post('/updateOwner')
  updateOwner(
    @Body() requestBody: { channelName: { name: string }; owner: User },
  ): Promise<Channel> {
    return this.ChannelService.updateOwner(requestBody);
  }

  @Roles('member')
  @Post('/addMembers')
  addMembers(
    @Body() requestBody: { channelName: { name: string }; members: User[] },
  ): Promise<Channel> {
    return this.ChannelService.addMembers(requestBody);
  }

  @Roles('admin')
  @Post('/replaceMembers')
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

  @Roles('owner')
  @Post('/updatePassword')
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
