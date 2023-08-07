import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

// interface User {
//   createdAt: string;
//   updatedAt: string;
//   user_id: string;
//   login: string;
//   email: string ;
//   hash: string;
//   rtHash: string;
//   fA: string ;
//   faEnabled: string ;
//   avatar: string;
//   status: string ;
//   totalFriends: number;
//   totalBlockedFriends: number ;
//   totalMatches: number ;
//   totalWins: number ;
//   totalLoss: number ;
//   level: number ;
//   rank: number ;
//   FriendSuggestions: any[]; // ou spécifiez un type approprié ici
// }
@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService, private userServ: UserService) {}

  async requestFriendship(senderId: string, receiverId: string) {
    const sender = await this.userServ.searchUser(senderId);
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
          SenderAv: sender.avatar,
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
          blocked: true,
        },
      });
      if (user) {
        const allFriends = user.friends.concat(user.friendOf);
        allFriends.forEach((e) => {
          // console.log('All friends ', e.login)
        });
        const blockedFriends = user.blocked;
        const onlyFriends = allFriends.filter(
          (el) => !blockedFriends.some((obj) => obj.login === el.login),
        );
        return onlyFriends;
      }
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
          blocked: true,
          blockedBy: true,
        },
      });
      if (user) {
        return user.blocked;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getFriendSuggestions(nick: string) {
    const toDelete: Array<string> = [];
    const toDisplay: Array<string> = [];
    const userConcerned = await this.userServ.searchUser(nick);
    // console.log('le user ', userConcerned.login)
    const requestedFriends = userConcerned.FriendRequestSent;
    const friendsThatRequested = userConcerned.FriendRequestReceived;
    const friends = userConcerned.friends;
    const friendOf = userConcerned.friendOf;
    requestedFriends.map((e) => toDelete.push(e.receiverId));
    friendsThatRequested.map((e) => toDelete.push(e.senderId));
    friends.map((e) => toDelete.push(e.login));
    friendOf.map((e) => toDelete.push(e.login));
    toDelete.push(userConcerned.login);
    // console.log('toDelete ', toDelete)
    const allUsers = await this.userServ.findAll();
    const filteredUsers: User[] = allUsers.filter(
      (obj) => !toDelete.includes(obj.login),
    );
    // console.log('suggestions ', filteredUsers)
    return filteredUsers;
  }

  async ismyfriend(body) {
    const resultat = {
      isMyfriend: false,
      myBlockedFriend: false,
      thoseWhoBlockedMe: false,
    };
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        login: body.me,
      },
      select: {
        friends: {
          select: {
            login: true,
          },
          where: {
            login: body.him,
          },
        },
        friendOf: {
          select: {
            login: true,
          },
          where: {
            login: body.him,
          },
        },
      },
    });
    const isUserInFriendsArray =
      user?.friends.length > 0 || user?.friendOf.length > 0;
    resultat.isMyfriend = isUserInFriendsArray;
    if (isUserInFriendsArray) {
      const iBlocked = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: body.me,
        },
        select: {
          blocked: {
            select: {
              login: true,
            },
            where: {
              login: body.him,
            },
          },
        },
      });
      const isUserBlockedArray = iBlocked?.blocked.length > 0;
      resultat.myBlockedFriend = isUserBlockedArray;
    }
    const theyBlocked = await this.prisma.user.findUniqueOrThrow({
      where: {
        login: body.me,
      },
      select: {
        blockedBy: {
          select: {
            login: true,
          },
          where: {
            login: body.him,
          },
        },
      },
    });
    const amInBlockedArray = theyBlocked?.blockedBy.length > 0;
    resultat.thoseWhoBlockedMe = amInBlockedArray;
    return resultat;
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
      console.log('le user depuis acceptance ', user.login);
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
