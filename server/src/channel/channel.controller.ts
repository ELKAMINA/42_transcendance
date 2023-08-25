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

type DateTime = Date;

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
	) { }

	@Post('/creation')
	createChannel(@Req() request: Request, @Body() dto: ChannelDto): Promise<boolean> {
		const userNickname = this.getUserInfoFromRequest(request.headers.cookie).nickname;
		return this.ChannelService.createChannel(userNickname, dto);
	}

	@Post('/userchannels')
	getUserChannels(@Req() request: Request): Promise<object> {
		const userNickname = this.getUserInfoFromRequest(request.headers.cookie).nickname;
		return this.ChannelService.getUserChannels(userNickname);
	}

	@Roles('member')
	@Post('/displayed')
	getDisplayedChannel(@Body() requestBody): Promise<object> {
		return this.ChannelService.getDisplayedChannel(requestBody.name);
	}

	@Post('/fetchPublicChannels')
	getPublicChannels(): Promise<object> {
		return this.ChannelService.getAllPublicChannelsInDatabase();
	}

	@Roles('owner')
	@Post('/deleteChannelByName')
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

	@Roles('owner')
	@Post('/updateAdmins')
	updateAdmins(
		@Body() requestBody: { channelName: { name: string }; admins: User[] },
	): Promise<Channel> {
		return this.ChannelService.updateAdmins(requestBody);
	}

	// IF USERS WHO ARE BEING BANNED ARE ADMINS : @ROLES('OWNER')
	// IF USERS WHO ARE BEING BANNED ARE MEMBERS : @ROLES('ADMIN')
	// IF USER WHO IS BEING BANNED IS THE OWNER : FORBIDDEN
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

	// IF USERS WHO ARE BEING MUTED ARE ADMINS : @ROLES('OWNER')
	// IF USERS WHO ARE BEING MUTED ARE MEMBERS : @ROLES('ADMIN')
	// IF USER WHO IS BEING MUTED IS THE OWNER : FORBIDDEN
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

	@Roles('admin')
	@Post('/addMembers')
	addMembers(
		@Body() requestBody: { channelName: { name: string }; members: User[] },
	): Promise<Channel> {
		return this.ChannelService.addMembers(requestBody);
	}

	// IF USERS WHO ARE BEING KICKED ARE ADMINS : @ROLES('OWNER')
	// IF USERS WHO ARE BEING KICKED ARE MEMBERS : @ROLES('ADMIN')
	// IF USER WHO IS BEING KICKED IS THE OWNER : FORBIDDEN
	@Post('/replaceMembers')
	replaceMembers(
		@Body()
		requestBody: {
			channelName: { name: string };
			members: User[];
			action: string;
		},
	): Promise<Channel> {
		// console.log('request body', requestBody);
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
