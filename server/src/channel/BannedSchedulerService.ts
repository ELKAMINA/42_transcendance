import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannedSchedulerService {
	private readonly logger = new Logger(BannedSchedulerService.name);

	constructor(private readonly prismaService: PrismaService) {}

	@Cron('0 * * * * *') // This cron expression runs the task every minute
	async handleUnbannedTask() {
		// this.logger.debug('Running automatic unbanned task...');

		// Get the current timestamp
		const currentTimestamp = new Date();

		// Fetch all users whose 'BannedExpiry' is in the past 
		// (the present is already the past!) 
		// and get the channels that needs to be updated
		const usersWithbanneddChannels = await this.prismaService.user.findMany({
			where: {
					BannedExpiry: {
						lte: currentTimestamp, // checks if the BannedExpiry field is less than or equal to the current timestamp -- lte : less than or equal to
					},
			},
			include: {
				bannedFromChannels: {
					include : {
						banned : true,
					},
				},
			},

   		});

	// console.log("usersWithbanneddChannels = ", usersWithbanneddChannels);
	
	// Loop through each user and remove them from the bannedd 
	// list in the respective channels
	for (const user of usersWithbanneddChannels) {
		const channelsToUnbannedUser = user.bannedFromChannels.filter(
			(channel) => channel.banned.some((bannedUser) => bannedUser.login === user.login),
		);

		if (channelsToUnbannedUser.length > 0) {
		// I update the `bannedd` array in the `Channel` model
		// to remove the user from the `bannedd` list in each 
		// `channelsToUnbannedUser`.

			await Promise.all(
				channelsToUnbannedUser.map(async (channel) => {
					await this.prismaService.channel.update({
						where: { channelId: channel.channelId },
						data: {
							banned: {
								disconnect: {
									login: user.login,
								},
							},
						},
					});
				}),
        );

        this.logger.debug(
          `Unbanned user ${user.login} in channels: ${channelsToUnbannedUser.map((channel) => channel.name).join(', ')}.`,
        );
      }
    }
  }
}
