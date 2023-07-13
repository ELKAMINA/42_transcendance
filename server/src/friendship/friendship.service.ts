import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async requestFriendship(senderId: string, receiverId: string) {
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        AND: [{ senderId: senderId }, { receiverId: receiverId }],
      },
    });

    if (existingRequest) {
      console.log('Friend request already exists!');
      return;
    } else {
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
  }

  async getFriendReqReceived(userLogin: string) {
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
    } catch (e) {
      console.log(e);
    }
  }

  async getFriendReqSent(userLogin: string) {
    try {
      const users = await this.prisma.friendRequest.findMany({
        where: {
          senderId: userLogin,
        },
        include: {
          receiver: true,
        },
      });
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
          friendOf: true,
        },
      });
      if (user){
        return (user.friends.concat(user.friendOf));
    } 
  }
    catch (e) {
      console.log(e);
    }
}

async ismyfriend(body) {
  const resultat = {
    isMyfriend: false,
    myBlockedFriend: false,
    thoseWhoBlockedMe: false
  }
  const user = await this.prisma.user.findUniqueOrThrow({
    where: {
      login: body.me,
    },
    select: {
      friends:{
        select:{
          login: true,
        },
        where: {
          login: body.him,
        }
      },
      friendOf:{
        select:{
          login: true,
        },
        where: {
          login: body.him,
        }
      },
    }
  })
  const isUserInFriendsArray = user?.friends.length > 0 || user?.friendOf.length > 0;
  resultat.isMyfriend = isUserInFriendsArray;
  if (isUserInFriendsArray) {
    const iBlocked = await this.prisma.user.findUniqueOrThrow({
      where: {
        login: body.me,
      },
      select: {
        blocked:{
          select:{
            login: true,
          },
          where: {
            login: body.him,
          }
        },
      }
    })
    const isUserBlockedArray = iBlocked?.blocked.length > 0
    resultat.myBlockedFriend = isUserBlockedArray;
  }
  const theyBlocked = await this.prisma.user.findUniqueOrThrow({
    where: {
      login: body.me,
    },
    select: {
      blockedBy:{
        select:{
          login: true,
        },
        where: {
          login: body.him,
        }
      },
    }
  })
  const amInBlockedArray = theyBlocked?.blockedBy.length > 0
  resultat.thoseWhoBlockedMe = amInBlockedArray;
  return resultat;
}
  // async getSuggestions()

  // async getAllBlockedFriends(userLogin: string) {
  //   try {
  //     const user = await this.prisma.user.findUniqueOrThrow({
  //       where: {
  //         login: userLogin,
  //       },
  //       include: {
  //         blockedFriends: true,
  //       },
  //     });
  //     if (user) return user.blockedFriends;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

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
          FriendRequestSent: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  async blockFriend(senderId: string, recId: string) {
    try {
    //   console.log('sender ', senderId);
    //   console.log('rec ', recId);
      const user = await this.prisma.user.update({
        where: { login: senderId },
        data: {
          blocked: { connect: { login: recId } },
          totalFriends: { decrement: 1 },
          totalBlockedFriends: { increment: 1 },
        },
        include: {
          blocked: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  }
}
