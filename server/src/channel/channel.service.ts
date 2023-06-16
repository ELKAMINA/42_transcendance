import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async searchChannel(nick: string) {
    try {
      const channel = await this.prisma.channel.findUniqueOrThrow({
        where: {
          login: nick,
        },
      });
      return channel;
    } catch (e) {
    //   console.log(e);
    }
  }

  async findAll() {
    try {
      const channels = await this.prisma.channel.findMany();
      console.log('all the channels ', channels);
      return channels;
    } catch (e) {
      console.log(e);
    }
  }
}
