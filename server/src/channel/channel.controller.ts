import { Body, Post, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { parse } from 'cookie';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';

import { Channel } from '@prisma/client';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { ChannelService } from '../channel/channel.service';
import { ChannelReqNameDto } from './dto/requestBodyNamePayload.dto';
import { ChannelReqPwdDto } from './dto/channelReqPwd.dto';
import { ChannelReqAdminsDto } from './dto/channelReqAdminUpdate.dto';
import { ChannelReqBannedDto } from './dto/channelReqBannedUpdate.dto';
import { ChannelReqMutedDto } from './dto/channelReqMutedUpdate.dto';
import { ChannelReqOwnerDto } from './dto/channelReqOwnerUpdate.dto';
import { ChannelReqMembersDto } from './dto/channelReqMember.dto';
import { ChannelReqUpdateMembersDto } from './dto/channelReqMembersUpdate.dto';
import { ChannelReqUpdatePwdDto } from './dto/channelReqUpdatePwd.dto';

export type UserWithTime = {
  login: string;
  ExpiryTime: string | null;
};

@UseGuards(RolesGuard)
@Controller('channel')
@ApiTags('channel')
export class channelController {
  constructor(
    private ChannelService: ChannelService,
    private prismaService: PrismaService,
  ) {}

  @Post('/creation')
  createChannel(
    @Req() request: Request,
    @Body() dto: ChannelDto,
  ): Promise<boolean> {
    let userNickname;
    if (request.headers.cookie) {
      userNickname = this.getUserInfoFromRequest(
        request.headers.cookie,
      ).nickname;
    }
    return this.ChannelService.createChannel(userNickname, dto);
  }

  @Post('/userchannels')
  getUserChannels(@Req() request: Request): Promise<object> {
    let userNickname;
    if (request.headers.cookie) {
      userNickname = this.getUserInfoFromRequest(
        request.headers.cookie,
      ).nickname;
    }
    return this.ChannelService.getUserChannels(userNickname);
  }

  @Roles('member')
  @Post('/displayed')
  getDisplayedChannel(@Body() requestBody: ChannelReqNameDto): Promise<object> {
    // console.log("getting displayed channel!")
    return this.ChannelService.getDisplayedChannel(requestBody.name);
  }

  @Post('/fetchPublicChannels')
  getPublicChannels(): Promise<object> {
    return this.ChannelService.getAllPublicChannelsInDatabase();
  }

  @Roles('owner')
  @Post('/deleteChannelByName')
  deleteChannelByName(@Body() requestBody: ChannelReqNameDto): Promise<void> {
    return this.ChannelService.deleteChannelByName(requestBody);
  }

  @Roles('member')
  @Post('/checkPwd')
  checkPwd(@Body() requestBody: ChannelReqPwdDto): Promise<boolean> {
    return this.ChannelService.checkPwd(requestBody);
  }

  @Roles('owner')
  @Post('/updateAdmins')
  updateAdmins(@Body() requestBody: ChannelReqAdminsDto): Promise<Channel> {
    return this.ChannelService.updateAdmins(requestBody);
  }

  // IF USERS WHO ARE BEING BANNED ARE ADMINS : @ROLES('OWNER')
  // IF USERS WHO ARE BEING BANNED ARE MEMBERS : @ROLES('ADMIN')
  // IF USER WHO IS BEING BANNED IS THE OWNER : FORBIDDEN
  @Roles('admin')
  @Post('/updateBanned')
  updateBanned(@Body() requestBody: ChannelReqBannedDto): Promise<Channel> {
    return this.ChannelService.updateBanned(requestBody);
  }

  // IF USERS WHO ARE BEING MUTED ARE ADMINS : @ROLES('OWNER')
  // IF USERS WHO ARE BEING MUTED ARE MEMBERS : @ROLES('ADMIN')
  // IF USER WHO IS BEING MUTED IS THE OWNER : FORBIDDEN
  @Roles('admin')
  @Post('/updateMuted')
  updateMuted(@Body() requestBody: ChannelReqMutedDto): Promise<Channel> {
    return this.ChannelService.updateMuted(requestBody);
  }

  @Roles('owner')
  @Post('/updateOwner')
  updateOwner(@Body() requestBody: ChannelReqOwnerDto): Promise<Channel> {
    return this.ChannelService.updateOwner(requestBody);
  }

  @Post('/addMembers')
  addMembers(@Body() requestBody: ChannelReqMembersDto): Promise<Channel> {
    return this.ChannelService.addMembers(requestBody);
  }

  // IF USERS WHO ARE BEING KICKED ARE ADMINS : @ROLES('OWNER')
  // IF USERS WHO ARE BEING KICKED ARE MEMBERS : @ROLES('ADMIN')
  // IF USER WHO IS BEING KICKED IS THE OWNER : FORBIDDEN
  // IF USER WHO IS LEAVING IS OWNER : FORBIDDEN
  @Post('/replaceMembers')
  replaceMembers(
    @Body() requestBody: ChannelReqUpdateMembersDto,
  ): Promise<Channel> {
    return this.ChannelService.replaceMembers(requestBody);
  }

  @Roles('owner')
  @Post('/updatePassword')
  updatePassword(
    @Body() requestBody: ChannelReqUpdatePwdDto,
  ): Promise<Channel> {
    return this.ChannelService.updatePassword(requestBody);
  }

  getUserInfoFromRequest(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }
}
