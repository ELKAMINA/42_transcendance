import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
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
      // console.log('users', users);
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllFriends(userLogin: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: userLogin,
        },
        include: {
          friends: true,
        },
      });
      if (user) return user.friends;
    } catch (e) {
      console.log(e);
    }
  }

  async acceptFriend(senderId: string, receiverId: string): Promise<User> {
    const newFriend = await this.userServ.acceptFriend(senderId, receiverId);
    return newFriend;
  }

  async blockFriend(senderId: string, receiverId: string): Promise<User> {
    const newFriend = await this.userServ.blockFriend(senderId, receiverId);
    return newFriend;
  }
}
