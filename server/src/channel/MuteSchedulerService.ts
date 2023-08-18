import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './../chat/gateway/chat.gateway';

@Injectable()
export class MuteSchedulerService {
  private readonly logger = new Logger(MuteSchedulerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Cron('0 * * * * *') // This cron expression runs the task every minute
  async handleUnmuteTask() {
    // this.logger.debug('Running automatic unmute task...');

    // Get the current timestamp
    const currentTimestamp = new Date();

    // Fetch all users whose 'MutedExpiry' is in the past
    // (the present is already the past!)
    // and get the channels that needs to be updated
    const usersWithMutedChannels = await this.prismaService.user.findMany({
      where: {
        MutedExpiry: {
          lte: currentTimestamp, // checks if the MutedExpiry field is less than or equal to the current timestamp -- lte : less than or equal to
        },
      },
      include: {
        MutedInChannels: {
          include: {
            muted: true,
          },
        },
      },
    });

    // Loop through each user and remove them from the muted
    // list in the respective channels
    for (const user of usersWithMutedChannels) {
      const channelsToUnmuteUser = user.MutedInChannels.filter((channel) =>
        channel.muted.some((mutedUser) => mutedUser.login === user.login),
      );

      if (channelsToUnmuteUser.length > 0) {
        // I update the `muted` array in the `Channel` model
        // to remove the user from the `muted` list in each
        // `channelsToUnmuteUser`.

        await Promise.all(
          channelsToUnmuteUser.map(async (channel) => {
            await this.prismaService.channel.update({
              where: { channelId: channel.channelId },
              data: {
                muted: {
                  disconnect: {
                    login: user.login,
                  },
                },
              },
            });
          }),
        );

        this.logger.debug(
          `Unmuted user ${user.login} in channels: ${channelsToUnmuteUser
            .map((channel) => channel.name)
            .join(', ')}.`,
        );

        this.chatGateway.notifyWhenUnmuted(
          user.login,
          channelsToUnmuteUser.map((channel) => channel.name).join(', '),
        );
      }
    }
  }
}
