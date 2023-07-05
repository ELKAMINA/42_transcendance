import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService) {}

	async createChannel(dto: ChannelDto): Promise<object> {
		// console.log('dto = ', dto);
		const pwd = await argon.hash(dto.key);
		try {

			// before creating the Channel record, 
			// we fetch the User record with the specified login value using this.prisma.user.findUnique(). 
			// If the creator record is not found, 
			// we throw a NotFoundException with an appropriate error message.
			const creator = await this.prisma.user.findUnique({
				where: { login: dto.createdBy },
			});
			if (!creator) {
				throw new NotFoundException(`User with login '${dto.createdBy}' not found.`);
			}
			// we create channel record
			const channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					members: {connect: dto.members.map((user) => ({ login: user.login })),},
					createdBy: {
						connect: {login: dto.createdBy}
					},
					type: dto.type,
					key: pwd,
				} as Prisma.ChannelCreateInput,
			});
			return channel;
		} catch (error: any) {
			  throw error;
		}
	}

	async deleteChannelByName(requestBody : {name : string | string[]}): Promise<void> {
		try {
		  	const channelNames = Array.isArray(requestBody.name) ? requestBody.name : [requestBody.name];
			for (const name of channelNames) {
				const channel = await this.prisma.channel.findUnique({ where: {name : name} });
				if (!channel) {
					throw new NotFoundException(`Channel with name '${name}' not found.`);
				}
		
				await this.prisma.channel.delete({ where: { name : name } });
				console.log(`The channel named '${name}' has been deleted.`);
			}
		} catch (error: any) {
			throw error;
		}
	}

	async  deleteAllChannels(): Promise<void> {
		try {
			// Fetch all channels from the database
			const channels = await this.prisma.channel.findMany();
		
			// Delete each channel
			for (const channel of channels) {
				await this.prisma.channel.delete({
				where: { channelId: channel.channelId },
				});
				console.log(`Deleted channel with ID: ${channel.channelId}`);
		  }
	  
		console.log('All channels have been deleted.');
		} catch (error: any) {
			throw error;
		}
	  }	  

	async getUserChannels(requestBody: {}): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where: requestBody,
			// the include option means that when fetching the user information, 
			// the response will include the 'channels' and 
			// 'createdChannels' fields of the user in 
			// addition to the main user entity.
			include: {
				channels : true,
				createdChannels: true,
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		  }

		const output = [...user.channels, ...user.createdChannels];
		return output;
	}

	async getCreatedByUserChannels(requestBody: {}): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where: requestBody,
			include: {
				channels : false, 
				createdChannels: true,
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const output = [...user.createdChannels];
		return output;
	}

	async getUserIsAMemberChannels(requestBody: {}): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where: requestBody,
			include: {
				channels : true, 
				createdChannels: false,
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const output = [...user.channels];
		return output;
	}

	async getAllChannelsInDatabase(): Promise<object> {
		const channels = await this.prisma.channel.findMany();
		return channels;
	}

	// requestBody = {name : <name of the channel>}
	async getDisplayedChannel(requestBody: {}): Promise<object> {
		const channel = await this.prisma.channel.findUnique({
			where: requestBody,
			include: {
				members: true,
				createdBy: true,
				chatHistory: true,
			}
		});
		if (!channel) {
			throw new NotFoundException('User not found');
		}
		// console.log('displayed channel found = ', channel);
		return channel;
	}
}
