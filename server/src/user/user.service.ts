import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { send } from 'process';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async searchUser(nick: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: nick,
        },
      });
      return user;
    } catch (e) {
      // console.log(e);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      // console.log('all the users ', users);
      return users;
    } catch (e) {
      // console.log(e);
    }
  }

  async acceptFriend(senderId: string, recId: string): Promise<User> {
    try {
      const reqId = await this.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: recId }, { receiverId: senderId }],
        },
      });
      await this.prisma.friendRequest.delete({
        where: { id: reqId.id },
      });
      const user = await this.prisma.user.update({
        where: { login: senderId },
        data: {
          friends: {
            connect: { login: recId },
          },
          totalFriends: { increment: 1 }, // ne marche pas
        },
        include: {
          friends: true,
          FriendRequestReceived: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
