import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserUpdatesDto } from '../user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // private gameService: GameService,
  ) {}

  async searchUser(nick: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          login: nick,
        },
        include: {
          blocked: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          blockedBy: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          friendOf: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          friends: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          FriendRequestReceived: true,
          FriendRequestSent: true,
          p1: true,
          p2: true,
          adminChannels: true,
          channels: true,
          createdChannels: true,
          ownedChannels: true,
          bannedFromChannels: true,
          MutedInChannels: true,
        },
      });
      if (user) {
        delete user.hash;
        delete user.fA;
        delete user.email;
        delete user.rtHash;
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      for (const user of users) {
        delete user.hash;
        delete user.fA;
        delete user.email;
        delete user.rtHash;
      }
      return users;
    } catch (e) {
      return null;
    }
  }

  async getUserProfile(query: Record<string, any>) {
    const { ProfileName } = query;
    const user = await this.searchUser(ProfileName);
    if (user) return user;
    else return null;
  }

  async getActualUser(body) {
    // console.log('le body de la requete ', body)
    const user = await this.searchUser(body.nickname);
    if (user) return user;
    else return null;
  }

  async updateUserInfo(userInfo: UserUpdatesDto) {
    let boolean = false;
    let provider;
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: userInfo.oldNick,
        },
      });
      provider = user.provider;
      //   if (user.hash && userInfo.pwd !== '') {
      //     const newHashedPwd = await argon.hash(userInfo.pwd);
      //     const up1 = await this.prisma.user.update({
      //       where: {
      //         login: userInfo.oldNick,
      //       },
      //       data: {
      //         hash: newHashedPwd,
      //       },
      //     });
      //     // console.log('jup1', up1);
      //     boolean = true;
      //   }
      if (
        // user.provider === 'not42' &&
        user.hash &&
        userInfo.pwd !== '' &&
        (await argon.verify(user.hash, userInfo.pwd)) === false
      ) {
        // console.log('je definis le pwd 222222');
        const newHashedPwd = await argon.hash(userInfo.pwd);
        const up1 = await this.prisma.user.update({
          where: {
            login: userInfo.oldNick,
          },
          data: {
            hash: newHashedPwd,
          },
        });
        boolean = true;
      }
      if (userInfo.atr !== '' && user.avatar !== userInfo.atr) {
        const up2 = await this.prisma.user.update({
          where: {
            login: userInfo.oldNick,
          },
          data: {
            avatar: userInfo.atr,
          },
        });
        // console.log('jup2', up2);

        boolean = true;
      }
      if (userInfo.login !== '' && user.login !== userInfo.login) {
        // console.log('userInfo ', userInfo);
        const duplicate = await this.prisma.user.findUnique({
          where: { login: userInfo.login },
        });
        if (duplicate && duplicate.login === userInfo.login) {
          // console.log('duplicate login ', duplicate.login);
          return new ForbiddenException('Credentials taken');
        }
        const up4 = await this.prisma.user.update({
          where: {
            login: userInfo.oldNick,
          },
          data: {
            login: userInfo.login,
          },
        });
        // console.log('jup4', up4);

        boolean = true;
      }
      if (boolean && provider === '42') {
        const up5 = await this.prisma.user.update({
          where: {
            login: userInfo.login !== '' ? userInfo.login : userInfo.oldNick,
          },
          data: {
            provider: '42-updated',
          },
        });
        // console.log('up5', up5);
      }
      const finalUser = await this.prisma.user.findUnique({
        where: {
          login: userInfo.login !== '' ? userInfo.login : userInfo.oldNick,
        },
      });
      //   console.log('final User ', finalUser);
      if (finalUser) {
        delete finalUser.hash;
        delete finalUser.fA;
        delete finalUser.email;
        delete finalUser.rtHash;
        return finalUser;
      }
    } catch (error: any) {
      if (
        error.constructor.name === Prisma.PrismaClientKnownRequestError.name
      ) {
        if (error.code === 'P2002') {
          return new ForbiddenException('Credentials taken');
        }
      }
      return error;
    } // PrismaClientKnownRequestEr
  }

  async updateData(nickName: string, dataToUpdate: any) {
    try {
      const user = await this.prisma.user.update({
        where: {
          login: nickName,
        },
        data: dataToUpdate,
        include: {
          blocked: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          blockedBy: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          friendOf: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          friends: {
            select: {
              login: true,
              user_id: true,
              faEnabled: true,
              avatar: true,
              provider: true,
              status: true,
              blockedBy: true,
              friendOf: true,
              friends: true,
              FriendRequestReceived: true,
              FriendRequestSent: true,
              p1: true,
              p2: true,
              adminChannels: true,
              channels: true,
              createdChannels: true,
              ownedChannels: true,
              bannedFromChannels: true,
              MutedInChannels: true,
            },
          },
          FriendRequestReceived: true,
          FriendRequestSent: true,
        },
      });

      delete user.hash;
      delete user.fA;
      delete user.email;
      delete user.rtHash;
      return user;
    } catch (error: any) {
      // console.log("user = ", user)
      console.error('user not found!');
    }

    // if (!user) {
    // console.error('user not found!');
    // }
    // if (user) {
    //   delete user.hash;
    //   delete user.fA;
    //   delete user.email;
    //   delete user.rtHash;
    //   return user;
    // }
  }
}
