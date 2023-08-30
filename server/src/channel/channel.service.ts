import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelDto } from './dto/channelPayload.dto';
import * as argon from 'argon2';
import { Channel, Prisma, User } from '@prisma/client';
import { UserWithTime } from './channel.controller';
import dayjs from 'dayjs';
import { UserByLogin } from 'src/user/types';

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService) { }

	async createChannel(userNickname: string, dto: ChannelDto): Promise<boolean> {
		const pwd = dto.key !== '' ? await argon.hash(dto.key) : '';
		// const isProtectedByPassword = dto.key !== '' ? true : false;
		try {
			// before creating the Channel record,
			// we fetch the User record with the specified login value using this.prisma.user.findUnique().
			// If the creator record is not found,
			// we throw a NotFoundException with an appropriate error message.
			const creator = await this.prisma.user.findUnique({
				where: { login: userNickname },
			});
			if (!creator) {
				throw new NotFoundException(
					`User with login '${userNickname}' not found.`,
				);
			}

			// we check if channel already exist
			const channelExist = await this.prisma.channel.findUnique({
				where: {
					name: dto.name,
				},
			});
			if (channelExist) {
				throw new ForbiddenException('Channel name taken');
			}

			// we create channel record
			const channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					members: {
						connect: dto.members.map((user) => ({ login: user.login })),
					},
					admins: {
						connect: dto.admins.map((user) => ({ login: user.login })),
					},
					createdBy: {
						connect: { login: userNickname },
					},
					ownedBy: {
						connect: { login: userNickname },
					},
					type: dto.type,
					pbp: dto.key !== '' ? true : false,
					key: pwd,
				} as Prisma.ChannelCreateInput,
			});
			// we return true is the channel is successfully created
			return true;
		} catch (error: any) {
			console.error(error);
			throw new BadRequestException();
		}
	}

	async deleteChannelByName(requestBody: { name: string }): Promise<void> {
		try {
			const channelNames = Array.isArray(requestBody.name)
				? requestBody.name
				: [requestBody.name];
			for (const name of channelNames) {
				const channel = await this.prisma.channel.findUnique({
					where: { name: name },
				});
				if (!channel) {
					throw new NotFoundException(`Channel with name '${name}' not found.`);
				}

				await this.prisma.channel.delete({ where: { name: name } });
			}
		} catch (error: any) {
			console.error(error);
		}
	}

	async getUserChannels(requestBody: string): Promise<object> {
		// console.log("[getUserChannels] requestBody = ", requestBody);
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					login: requestBody,
				},
				// the include option means that when fetching the user information,
				// the response will include the 'channels' and
				// 'createdChannels' fields of the user in
				// addition to the main user entity.
				include: {
					channels: {
						include: {
							members: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							admins: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							banned: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							muted: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							createdBy: true,
							ownedBy: true,
							chatHistory: true,
						},
					},
				},
			});
			if (!user) {
				throw new NotFoundException('User not found');
			}
			delete user.hash;
			delete user.fA;
			delete user.email;
			delete user.rtHash;
			const output = [...user.channels];
			return output;
		} catch (error) {
			console.error(error);
		}
	}

	// requestBody = {name : <name of the channel>}
	async getDisplayedChannel(requestBody: string): Promise<object> {
		// console.log("[getDisplayedChanne] requestBody = ", requestBody);
		if (requestBody === undefined) return undefined; // this case will be handled in channelSlice
		try {
			const channel = await this.prisma.channel.findUnique({
				where: { name: requestBody },
				include: {
					members: {
						select: {
							blocked: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							blockedBy: {
								select: {
									login: true,
									user_id: true,
									faEnabled: true,
									avatar: true,
									provider: true,
									status: true,
									blockedBy: true,
									friendOf: true,
									friends: true,
									FriendRequestReceived: true,
									FriendRequestSent: true,
									p1: true,
									p2: true,
									adminChannels: true,
									channels: true,
									createdChannels: true,
									ownedChannels: true,
									bannedFromChannels: true,
									MutedInChannels: true,
								},
							},
							login: true,
							user_id: true,
							faEnabled: true,
							avatar: true,
							provider: true,
							status: true,
							FriendRequestReceived: true,
							FriendRequestSent: true,
							p1: true,
							p2: true,
							adminChannels: true,
							channels: true,
							createdChannels: true,
							ownedChannels: true,
							bannedFromChannels: true,
							MutedInChannels: true,
						},
					},
					admins: {
						select: {
							login: true,
							user_id: true,
							faEnabled: true,
							avatar: true,
							provider: true,
							status: true,
							blockedBy: true,
							friendOf: true,
							friends: true,
							FriendRequestReceived: true,
							FriendRequestSent: true,
							p1: true,
							p2: true,
							adminChannels: true,
							channels: true,
							createdChannels: true,
							ownedChannels: true,
							bannedFromChannels: true,
							MutedInChannels: true,
						},
					},
					banned: {
						select: {
							login: true,
							user_id: true,
							faEnabled: true,
							avatar: true,
							provider: true,
							status: true,
							blockedBy: true,
							friendOf: true,
							friends: true,
							FriendRequestReceived: true,
							FriendRequestSent: true,
							p1: true,
							p2: true,
							adminChannels: true,
							channels: true,
							createdChannels: true,
							ownedChannels: true,
							bannedFromChannels: true,
							MutedInChannels: true,
						},
					},
					muted: {
						select: {
							login: true,
							user_id: true,
							faEnabled: true,
							avatar: true,
							provider: true,
							status: true,
							blockedBy: true,
							friendOf: true,
							friends: true,
							FriendRequestReceived: true,
							FriendRequestSent: true,
							p1: true,
							p2: true,
							adminChannels: true,
							channels: true,
							createdChannels: true,
							ownedChannels: true,
							bannedFromChannels: true,
							MutedInChannels: true,
						},
					},
					createdBy: true,
					ownedBy: true,
					chatHistory: true,
				},
			});
			if (!channel) {
				return undefined;
			}
			delete channel?.key;
			// console.log("[getDisplayedChanne] channel = ", channel);
			return channel;
		} catch (error) {
			if (requestBody !== 'WelcomeChannel') console.error(error);
		}
	}

	async getAllPublicChannelsInDatabase(): Promise<object> {
		const channels = await this.prisma.channel.findMany({
			where: {
				type: 'public', // Filter channels by type 'public'
			},
			include: {
				members: {
					include: {
						blocked: {
							select: {
								login: true,
								user_id: true,
								faEnabled: true,
								avatar: true,
								provider: true,
								status: true,
								blockedBy: true,
								FriendRequestReceived: true,
								FriendRequestSent: true,
								p1: true,
								p2: true,
								adminChannels: true,
								channels: true,
								createdChannels: true,
								ownedChannels: true,
								bannedFromChannels: true,
								MutedInChannels: true,
							},
						},
						blockedBy: {
							select: {
								login: true,
								user_id: true,
								faEnabled: true,
								avatar: true,
								provider: true,
								status: true,
								blockedBy: true,
								friendOf: true,
								friends: true,
								FriendRequestReceived: true,
								FriendRequestSent: true,
								p1: true,
								p2: true,
								adminChannels: true,
								channels: true,
								createdChannels: true,
								ownedChannels: true,
								bannedFromChannels: true,
								MutedInChannels: true,
							},
						},
					},
				},
				admins: {
					select: {
						login: true,
						user_id: true,
						faEnabled: true,
						avatar: true,
						provider: true,
						status: true,
						blockedBy: true,
						friendOf: true,
						friends: true,
						FriendRequestReceived: true,
						FriendRequestSent: true,
						p1: true,
						p2: true,
						adminChannels: true,
						channels: true,
						createdChannels: true,
						ownedChannels: true,
						bannedFromChannels: true,
						MutedInChannels: true,
					},
				},
				banned: {
					select: {
						login: true,
						user_id: true,
						faEnabled: true,
						avatar: true,
						provider: true,
						status: true,
						blockedBy: true,
						friendOf: true,
						friends: true,
						FriendRequestReceived: true,
						FriendRequestSent: true,
						p1: true,
						p2: true,
						adminChannels: true,
						channels: true,
						createdChannels: true,
						ownedChannels: true,
						bannedFromChannels: true,
						MutedInChannels: true,
					},
				},
				muted: {
					select: {
						login: true,
						user_id: true,
						faEnabled: true,
						avatar: true,
						provider: true,
						status: true,
						blockedBy: true,
						friendOf: true,
						friends: true,
						FriendRequestReceived: true,
						FriendRequestSent: true,
						p1: true,
						p2: true,
						adminChannels: true,
						channels: true,
						createdChannels: true,
						ownedChannels: true,
						bannedFromChannels: true,
						MutedInChannels: true,
					},
				},
				createdBy: true,
				ownedBy: true,
				chatHistory: true,
			},
		});

		return channels;
	}

	async checkPwd(requestBody: {
		pwd: string;
		obj: { name: string };
	}): Promise<boolean> {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: requestBody.obj,
			});
			if (!channel) {
				throw new Error(`Channel with name '${channel.name}' not found.`);
			}
			const isPasswordCorrect = await argon.verify(
				channel.key,
				requestBody.pwd,
			);
			return isPasswordCorrect;
		} catch (error: any) {
			console.error(error);
		}
	}

	async updateAdmins(requestBody: {
		channelName: { name: string };
		admins: User[];
	}): Promise<Channel> {
		// console.log('requestBody', requestBody);
		try {
			const { channelName, admins } = requestBody;
			// console.log("admins in args = ", admins);
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: {
					ownedBy: true,
					createdBy: true,
					admins: true,
				},
			});

			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			// get admin logins
			const adminIds = admins.map((admin) => ({ login: admin.login }));
			adminIds.push({ login: channel.ownedBy.login });
			// console.log('adminIds = ', admins);

			
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
			// console.log('updatedChannel = ', updatedChannel);
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async updateBanned(requestBody: {
		channelName: { name: string };
		banned: UserWithTime[];
	}): Promise<Channel> {
		try {
			const { channelName, banned } = requestBody;

			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: {
					banned: true,
					members: true,
					admins: true,
				},
			});

			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			// STEP 1 : get banned user ids --------------------------------------------------------------------------------------------
			const bannedIds = banned.map((banned) => ({ login: banned.login }));

			// STEP 2 : get members that are not banned ids ----------------------------------------------------------------------------
			const updatedMembers = channel.members.filter(
				(member) => !bannedIds.some((banned) => banned.login === member.login),
			);
			const updatedMembersId = updatedMembers.map((member) => ({
				login: member.login,
			}));
			// console.log("updatedMembersId = ", updatedMembersId);
			
			// STEP 3 : get admins that are not banned ids -----------------------------------------------------------------------------
			const updatedAdmins = channel.admins.filter(
				(admin) => !bannedIds.some((banned) => banned.login === admin.login),
			);
			const updatedAdminsId = updatedAdmins.map((admin) => ({
				login: admin.login,
			}));

			// STEP 4 : Update the channel's banned with the new array ------------------------------------------------------------------
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					banned: {
						set: bannedIds,
					},
					members: {
						set: updatedMembersId,
					},
					admins: {
						set: updatedAdminsId,
					},
				},
			});

			// Update the User model for each banned user with the BannedExpiry
			for (const bannedUser of banned) {
				const user = await this.prisma.user.update({
					where: {
						login: bannedUser.login,
					},
					data: {
						BannedExpiry: bannedUser.ExpiryTime ? bannedUser.ExpiryTime : null,
					},
				});
				// console.log(`Updated BannedExpiry for user with ID '${user.login}'`);
				// console.log('banned expiry = = ', user.BannedExpiry);
			}

			// console.log('updatedChannel = ', updatedChannel);
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async updateMuted(requestBody: {
		channelName: { name: string };
		muted: UserWithTime[];
	}): Promise<Channel> {
		try {
			const { channelName, muted } = requestBody;
			// console.log('muted = ', muted);

			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: {
					muted: true,
				},
			});

			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			const mutedIds = muted.map((muted) => ({ login: muted.login }));

			// Update the channel's muted with the new array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					muted: {
						set: mutedIds,
					},
				},
			});

			// Update the User model for each muted user with the MutedExpiry
			for (const mutedUser of muted) {
				const user = await this.prisma.user.update({
					where: {
						login: mutedUser.login,
					},
					data: {
						MutedExpiry: mutedUser.ExpiryTime ? mutedUser.ExpiryTime : null,
					},
				});
				// console.log(`Updated MutedExpiry for user with ID '${user.login}'`);
				// console.log('user updated = ', user.MutedExpiry);
			}

			// console.log('updatedChannel = ', updatedChannel);
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async updateOwner(requestBody: {
		channelName: { name: string };
		owner: User;
	}): Promise<Channel> {
		// console.log('requestBody', requestBody.owner.login);
		try {
			const { channelName, owner } = requestBody;

			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
			});

			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			// Update the channel's owner
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					ownedById: owner.login,
					admins: {
						connect: {
							login: owner.login,
						},
					},
				},
			});
			// console.log('updatedChannel = ', updatedChannel.ownedById);
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async addMembers(requestBody: {
		channelName: { name: string };
		members: User[];
	}): Promise<Channel> {
		try {
			const { channelName, members } = requestBody;
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: {
					members: true, // Include the current members of the channel
					banned: true,
				},
			});

			// if channel is not found, throw error
			if (!channel) {
				throw new Error(`Channel with name '${channelName.name}' not found.`);
			}

			// remove the banned members from the list of members we want to add
			const membersWithoutBanned = members.filter(
				(member) =>
					!channel.banned.some((banned) => member.login === banned.login),
			);

			// Extract the new member IDs from the request
			const newMemberIds = membersWithoutBanned.map((member) => member.login);

			// Extract the current member IDs from the retrieved channel
			const existingMemberIds = channel.members.map((member) => member.login);

			// Combine the existing and new member IDs
			const allMemberIds = [...existingMemberIds, ...newMemberIds];
			// console.log('allMemberIds = ', allMemberIds);

			// Update the channel's members with the combined array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					members: {
						connect: allMemberIds.map((login) => ({ login })),
					},
				},
			});

			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async replaceMembers(requestBody: {
		channelName: { name: string };
		members: User[];
		action: string;
	}): Promise<Channel> {
		// console.log("[replaceMembers - channel.services] requestBody = ", requestBody.channelName.name);
		try {
			const { channelName, members, action } = requestBody;
			// Find the channel by name
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName.name,
				},
				include: { admins: true },
			});

			if (!channel) {
				throw new Error(
					`Channel with ${action} name '${channelName.name}' not found.`,
				);
			}

			// Extract the new member IDs from the request
			const newMemberIds = members.map((member) => member.login);
			// console.log("new members of the channel = ", newMemberIds);
			// Fetch the current 'admins' of the channel
			const currentAdmins = channel.admins || [];

			// Identify admins who are no longer members
			const updatedAdmins = currentAdmins.filter((admin) =>
				newMemberIds.some((newMemberId) => newMemberId === admin.login),
			);
			const newAdminIds = updatedAdmins.map((admin) => admin.login);
			// console.log("new admins of the channel = ", newAdminIds);

			// Update the channel's members with the combined array
			const updatedChannel = await this.prisma.channel.update({
				where: {
					channelId: channel.channelId,
				},
				data: {
					members: {
						set: newMemberIds.map((login) => ({ login })),
					},
					admins: {
						set: newAdminIds.map((login) => ({ login })),
					},
				},
			});

			// console.log('[MEMBERS] updatedChannel = ', updatedChannel.name);
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async updatePassword(requestBody: {
		channelName: { name: string };
		key: string;
	}): Promise<Channel> {
		try {
			const { channelName, key } = requestBody;
			const pwd = key !== '' ? await argon.hash(key) : '';
			// console.log("key = ", key);
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
					pbp: true, // Set pbp to true
				},
			});
			delete updatedChannel?.key;
			return updatedChannel;
		} catch (error) {
			console.error(error);
		}
	}

	async checkChannel(requestBody : {channelName : {name : string}; members : User[]}): Promise<void> {
		const {channelName, members} = requestBody;
		const channel = await this.prisma.channel.findUnique({
			where: {
				name : channelName.name,
			},
			include: {
				members: true,
			},
		})

		if (!channel || channel.type !== 'privateConv') {
			return;
		}

		// console.log("channel members = ", channel.members);
		// console.log("members = ", members);

		// Filter out the deleted members
		const deletedMembers = channel.members.filter((member) => 
			!members.find((m) => m.login === member.login)
		);
		// console.log("deletedMembers = ", deletedMembers);

		if (deletedMembers.length > 0) {
			// Delete all channels of type 'privateConv' that have a deleted user as a member
			const channelsToDelete = await this.prisma.channel.findMany({
				where: {
					type: 'privateConv',
					members: {
						some: {
							login: {
								in: deletedMembers.map((deletedMember) => deletedMember.login),
							},
						},
					},
				},
			});
			// console.log("deleting channels = ", channelsToDelete)
			for (const channelToDelete of channelsToDelete) {
				await this.prisma.channel.delete({
					where: {
						name: channelToDelete.name,
					},
				});
			}
		}

	}
}
