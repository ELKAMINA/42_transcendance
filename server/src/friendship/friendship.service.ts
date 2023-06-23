import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

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

  async getAllBlockedFriends(userLogin: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: userLogin,
        },
        include: {
          blockedFriends: true,
        },
      });
      if (user) return user.blockedFriends;
    } catch (e) {
      console.log(e);
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

  async denyFriend(senderId: string, recId: string): Promise<User> {
    console.log('when denying friend, the sender is : ', senderId);
    console.log('when denying friend, the receiver is : ', recId);
    try {
      const reqId = await this.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: senderId }, { receiverId: recId }],
        },
      });
      await this.prisma.friendRequest.delete({
        where: { id: reqId.id },
      });
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { login: senderId },
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

  async blockFriend(senderId: string, recId: string): Promise<User> {
    try {
      console.log('sender ', senderId);
      console.log('rec ', recId);
      const user = await this.prisma.user.update({
        where: { login: recId },
        data: {
          blockedFriends: { connect: { login: senderId } },
          totalFriends: { decrement: 1 },
          totalBlockedFriends: { increment: 1 },
        },
        include: {
          blockedFriends: true,
        },
      });
      console.log('le suer qui a bloqué ', user);
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
