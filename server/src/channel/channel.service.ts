import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService) {}

	async createChannel(dto: ChannelDto): Promise<object> {
		console.log("coucouuuuu");
		const pwd = await argon.hash(dto.password);
		try {
			const channel = await this.prisma.channel.create({
				data: {
					name: dto.login,
					members: {
						createMany: {
							data: dto.userList,
						},
					},
					createdBy: {
						connect: {
							user_id: dto.owner,
						},
					},
					type: dto.type,
					key: pwd,
				},
			});
		return channel;
		} catch (error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
				  throw new ForbiddenException('Credentials taken');
				}
			  }
			  throw error;
		}
	}
}

