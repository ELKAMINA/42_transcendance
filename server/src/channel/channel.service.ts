import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';
import * as argon from 'argon2';
import { Channel, Prisma, User } from '@prisma/client';

@Injectable()
export class ChannelService {
	constructor(
		private prisma: PrismaService) {}

	async createChannel(dto: ChannelDto): Promise<object> {
		const pwd = dto.key !== '' ? await argon.hash(dto.key) : '';
		try {
			// before creating the Channel record, 
			// we fetch the User record with the specified login value using this.prisma.user.findUnique(). 
			// If the creator record is not found, 
			// we throw a NotFoundException with an appropriate error message.
			const creator = await this.prisma.user.findUnique({
				where: { login: dto.createdBy.login },
			});
			if (!creator) {
				throw new NotFoundException(`User with login '${dto.createdBy}' not found.`);
			}
			// we create channel record
			const channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					members: {connect: dto.members.map((user) => ({ login: user.login })),},
					admins: {connect: dto.admins.map((user) => ({ login: user.login })),},
					createdBy: {
						connect: {login: dto.createdBy.login}
					},
					type: dto.type,
					key: pwd,
				} as Prisma.ChannelCreateInput,
			});
			// we return the newly created channel
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
			}
		} catch (error: any) {
			throw error;
		}
	}

	// deletes only the channels created by the user which nickname is passed as a parameter
	async  deleteAllChannels(requestBody : {createdBy : string}): Promise<void> {
		try {
			const channelsToDelete = await this.prisma.channel.findMany({
				where: {
					createdById: requestBody.createdBy,
				},
			});
		  
			// delete all the associated messages 
			for (const channel of channelsToDelete) {
			await this.prisma.message.deleteMany({
				where: {
					channelById: channel.name,
				},
			});
			}
		  
			// delete all the channels that match the 'createdBy' string
			await this.prisma.channel.deleteMany({
				where: {
					createdById: requestBody.createdBy,
				},
			});
		} catch (error: any) {
			throw error;
		  }
	}

	async getUserChannels(requestBody: string): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where: {
				login: requestBody
			},
			// the include option means that when fetching the user information, 
			// the response will include the 'channels' and 
			// 'createdChannels' fields of the user in 
			// addition to the main user entity.
			include: {
				channels: {
					include: {
						members: true,
						admins: true,
						createdBy: true,
						chatHistory: true,
					}
				},
				createdChannels: {
					include: {
						members: true,
						admins: true,
						createdBy: true,
						chatHistory: true,
					}
				},
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		  }

		const output = [...user.channels, ...user.createdChannels];
		return output;
	}

	async getCreatedByUserChannels(requestBody: string): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where:{login: requestBody},
			include: {
				channels : false, 
				createdChannels: {
					include: {
						members: true,
						admins: true,
						createdBy: true,
						chatHistory: true,
					}
				},
			}
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const output = [...user.createdChannels];
		return output;
	}

	async getUserIsAMemberChannels(requestBody: string): Promise<object> {
		const user = await this.prisma.user.findUnique({
			where: {login: requestBody},
			include: {
				channels: {
					include: {
						members: true,
						admins: true,
						createdBy: true,
						chatHistory: true,
					}
				},
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
		const channels = await this.prisma.channel.findMany({
			include: {
				members: true,
				admins: true,
				createdBy: true,
				chatHistory: true,
			  }
		});
		return channels;
	}

	// requestBody = {name : <name of the channel>}
	async getDisplayedChannel(requestBody: string): Promise<object> {
		const channel = await this.prisma.channel.findUnique({
			where: {name: requestBody},
			include: {
				members: true,
				admins: true,
				createdBy: true,
				chatHistory: true,
			}
		});
		if (!channel) {
			throw new NotFoundException('User not found');
		}
		// console.log('channel ', channel)
		return channel;
	}






	async getUserPrivateChannels(requestBody: string): Promise<object> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {login: requestBody},
				// the include option means that when fetching the user information, 
				// the response will include the 'channels' and 
				// 'createdChannels' fields of the user in 
				// addition to the main user entity.
				include: {
					channels: {
						where: {
							type: 'private' // Filter channels by type 'private'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
					createdChannels: {
						where: {
							type: 'private' // Filter channels by type 'private'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
				}
			});
	
			if (!user) {
				throw new NotFoundException('User not found');
			}
	
			const output = [...user.channels, ...user.createdChannels];
			return output;
		} catch (error : any) {
			console.log('error = ', error);
		}
	}


	async getUserPublicChannels(requestBody: string): Promise<object> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {login: requestBody},
				// the include option means that when fetching the user information, 
				// the response will include the 'channels' and 
				// 'createdChannels' fields of the user in 
				// addition to the main user entity.
				include: {
					channels: {
						where: {
							type: 'public' // Filter channels by type 'public'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
					createdChannels: {
						where: {
							type: 'public' // Filter channels by type 'public'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
				}
			});
	
			if (!user) {
				throw new NotFoundException('User not found');
			}
	
			const output = [...user.channels, ...user.createdChannels];
			return output;
		} catch (error : any) {
			console.log('error = ', error);
		}
	}


	async getUserPrivateConvs(requestBody: string): Promise<object> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {login: requestBody},
				// the include option means that when fetching the user information, 
				// the response will include the 'channels' and 
				// 'createdChannels' fields of the user in 
				// addition to the main user entity.
				include: {
					channels: {
						where: {
							type: 'privateConv' // Filter channels by type 'privateConv'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
					createdChannels: {
						where: {
							type: 'privateConv' // Filter channels by type 'privateConv'
						},
						include: {
							members: true,
							admins: true,
							createdBy: true,
							chatHistory: true,
						}
					},
				}
			});
	
			if (!user) {
				throw new NotFoundException('User not found');
			}
	
			const output = [...user.channels, ...user.createdChannels];
			return output;
		} catch (error) {
			console.log('error : ', error);
		}
	}

	async getAllPrivateChannelsInDatabase(): Promise<object> {
		const channels = await this.prisma.channel.findMany({
			where: {
				type: 'private' // Filter channels by type 'private'
			}
		});
		
		return channels;
	}

	async getAllPublicChannelsInDatabase(): Promise<object> {
		const channels = await this.prisma.channel.findMany({
			where: {
				type: 'public' // Filter channels by type 'public'
			}
		});
		
		return channels;
	}

	async getAllPrivateConvsInDatabase(): Promise<object> {
		const channels = await this.prisma.channel.findMany({
			where: {
				type: 'privateConv' // Filter channels by type 'privateConv'
			}
		});
		
		return channels;
	}

	async checkPwd(requestBody: {pwd: string, obj : {name : string}}) : Promise<boolean> {
		try {
			const channel = await this.prisma.channel.findUnique({
				where : requestBody.obj,
			})
			const isPasswordCorrect = await argon.verify(channel.key, requestBody.pwd);
			return isPasswordCorrect;
		} catch (error : any) {
			throw error;
		}
	}

	async updateAdmins(requestBody : {channelName : {name : string}, admins : User[]}) : Promise<Channel> {
		// console.log('requestBody', requestBody);
		try 
		{
			const { channelName, admins } = requestBody;
		
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
			});
		
			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			// Convert admins array into an array of UserWhereUniqueInput objects
		    const adminIds = admins.map((admin) => ({ user_id: admin.user_id }));
		
			// Update the channel's admins with the new array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					admins: {
						set: adminIds,
					},
				},
			});
			// console.log('updatedChannel = ',updatedChannel);
			return updatedChannel;
		} catch (error) {
			throw error;
		}
	}

	async updateMembers(requestBody: { channelName: { name: string }, members: User[] }): Promise<Channel> {
		try {
			const { channelName, members } = requestBody;
	
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: {
					members: true, // Include the current members of the channel
				},
			});
	
			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}
	
			// Extract the current member IDs from the retrieved channel
			const existingMemberIds = channel.members.map((member) => member.user_id);
	
			// Extract the new member IDs from the request
			const newMemberIds = members.map((member) => member.user_id);
	
			// Combine the existing and new member IDs
			const allMemberIds = [...existingMemberIds, ...newMemberIds];
	
			// Update the channel's members with the combined array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					members: {
						connect: allMemberIds.map((user_id) => ({ user_id })),
					},
				},
			});
	
			console.log('[MEMBERS] updatedChannel = ', updatedChannel);
			return updatedChannel;
		} catch (error) {
			throw error;
		}
	}

	async updatePassword(requestBody : {channelName : {name : string}, key : string}) : Promise<Channel> {
		try 
		{
			const { channelName, key } = requestBody;
			const pwd = key !== '' ? await argon.hash(key) : '';
		
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
			});
		
			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}
		
			// Update the channel's admins with the new array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					key: {
						set: pwd,
					},
				},
			});
			return updatedChannel;
		} catch (error) {
			throw error;
		}
	}
	
}
