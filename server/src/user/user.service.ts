import { Injectable } from '@nestjs/common';
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

  async addFriend(senderId: string, receiverId: string) {
    try {
      const user = await this.prisma.user.update({
        where: { login: senderId },
        data: {
          friends: {
            connect: { login: receiverId },
          },
          totalFriends: { increment: 1 }, // ne marche pas
        },
        include: {
          friends: true,
          FriendRequestReceived: true,
        },
      });
      // console.log(user, { depth: null });
      console.log('user', user);
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
