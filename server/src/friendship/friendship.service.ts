import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService, private userServ: UserService) {}

  async requestFriendship(senderId: string, receiverId: string) {
    await this.prisma.friendRequest.create({
      data: {
        sender: {
          connect: { login: senderId },
        },
        receiver: {
          connect: { login: receiverId },
        },
        status: 'PENDING',
      },
    });
  }

  async getAllFriendReq(userLogin: string) {
    try {
      const users = await this.prisma.friendRequest.findMany({
        where: {
          receiverId: userLogin,
        },
        include: {
          sender: true,
        },
      });
      return users;
      // console.log('users', users);
    } catch (e) {
      console.log(e);
    }
  }

  async addFriend(senderId: string, receiverId: string) {
    return this.userServ.addFriend(senderId, receiverId);
  }
}
