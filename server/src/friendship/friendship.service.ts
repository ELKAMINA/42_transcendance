import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { HttpStatusCode } from 'axios';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService, private userServ: UserService) {}

  async requestFriendship(senderId: string, receiverId: string) {
    const sender = await this.userServ.searchUser(senderId);
    if (sender) {
      const existingRequest = await this.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: senderId }, { receiverId: receiverId }],
        },
      });
      if (existingRequest) {
        console.log('Friend request already exists!');
        return;
      }
      try {
        const newReq = await this.prisma.friendRequest.create({
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
        return newReq;
      } catch (e) {
        console.log('i got here ??');
        return null;
      }
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
      return e;
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
    const user = await this.prisma.user.findUnique({
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
      const blockedFriends = user.blocked;
      const onlyFriends = allFriends.filter(
        (el) => !blockedFriends.some((obj) => obj.login === el.login),
      );
      return onlyFriends;
    } else {
      throw new HttpException('No user found', HttpStatusCode.Forbidden);
    }
  }

  async getAllBlockedFriends(userLogin: string) {
    const user = await this.prisma.user.findUnique({
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
    return null;
  }

  async getFriendSuggestions(nick: string) {
    const toDelete: Array<string> = [];
    let filteredUsers: User[];

    const userConcerned = await this.userServ.searchUser(nick);
    if (!userConcerned) throw new ForbiddenException('No user Found');
    const requestedFriends = userConcerned.FriendRequestSent;
    const friendsThatRequested = userConcerned.FriendRequestReceived;
    const friends = userConcerned.friends;
    const friendOf = userConcerned.friendOf;
    if (requestedFriends) {
      requestedFriends.map((e) => toDelete.push(e.receiverId));
    }
    if (friendsThatRequested)
      friendsThatRequested.map((e) => toDelete.push(e.senderId));
    if (friends) friends.map((e) => toDelete.push(e.login));
    if (friendOf) friendOf.map((e) => toDelete.push(e.login));
    toDelete.push(userConcerned.login);
    const allUsers = await this.userServ.findAll();

    if (allUsers) {
      filteredUsers = allUsers.filter((obj) => !toDelete.includes(obj.login));
    }
    // console.log('suggestions ', filteredUsers)
    return filteredUsers;
  }

  async ismyfriend(body) {
    let isUserInFriendsArray;
    const resultat = {
      isMyfriend: false,
      myBlockedFriend: false,
      thoseWhoBlockedMe: false,
    };
    const user = await this.prisma.user.findUnique({
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
    if (user) {
      isUserInFriendsArray =
        user.friends.length > 0 || user.friendOf.length > 0;
      resultat.isMyfriend = isUserInFriendsArray;
      if (isUserInFriendsArray) {
        const iBlocked = await this.prisma.user.findUnique({
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
        if (iBlocked) {
          const isUserBlockedArray = iBlocked?.blocked.length > 0;
          resultat.myBlockedFriend = isUserBlockedArray;
        }
      }
      const theyBlocked = await this.prisma.user.findUnique({
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
      if (theyBlocked) {
        const amInBlockedArray = theyBlocked.blockedBy.length > 0;
        resultat.thoseWhoBlockedMe = amInBlockedArray;
      }
    }
    return resultat;
  }

  async acceptFriend(senderId: string, recId: string): Promise<User> {
    let user = null;
    try {
      const reqId = await this.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: recId }, { receiverId: senderId }],
        },
      });
      if (reqId) {
        await this.prisma.friendRequest.delete({
          where: { id: reqId.id },
        });
        user = await this.prisma.user.update({
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
      }
      console.log('le user depuis acceptance ', user.login);
      return user;
    } catch (e) {
      return null;
    }
  }

  async denyFriend(senderId: string, recId: string): Promise<User> {
    let user = null;
    try {
      const reqId = await this.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: senderId }, { receiverId: recId }],
        },
      });
      if (reqId) {
        await this.prisma.friendRequest.delete({
          where: { id: reqId.id },
        });
        user = await this.prisma.user.findUniqueOrThrow({
          where: { login: senderId },
          include: {
            friends: true,
            FriendRequestReceived: true,
            FriendRequestSent: true,
          },
        });
        return user;
      }
    } catch (e) {
      return null;
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
