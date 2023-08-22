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
          blocked: true,
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
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      //   console.log('all the users ', users);
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
    // console.log('le user ', user)
    if (user) return user;
    else return null;
  }

  async updateUserInfo(userInfo: UserUpdatesDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: userInfo.oldNick,
        },
      });
      // console.log('user ', user);
      if (
        userInfo.pwd !== '' &&
        (await argon.verify(user.hash, userInfo.pwd)) === false
      ) {
        const newHashedPwd = await argon.hash(userInfo.pwd);
        const up1 = await this.prisma.user.update({
          where: {
            login: userInfo.oldNick,
          },
          data: {
            hash: newHashedPwd,
          },
        });
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
      }
      const finalUser = await this.prisma.user.findUnique({
        where: {
          login: userInfo.login !== '' ? userInfo.login : userInfo.oldNick,
        },
      });
      return finalUser;
    } catch (error: any) {
      if (
        error.constructor.name === Prisma.PrismaClientKnownRequestError.name
      ) {
        if (error.code === 'P2002') {
          return new ForbiddenException('Credentials taken');
        }
      }
      // console.log('errrrooor ', error);
      return error;
    } // PrismaClientKnownRequestEr
  }

  async updateData(nickName: string, dataToUpdate: any) {
    const user = await this.prisma.user.update({
      where: {
        login: nickName,
      },
      data: dataToUpdate,
      include: {
        blocked: true,
        blockedBy: true,
        friendOf: true,
        friends: true,
        FriendRequestReceived: true,
        FriendRequestSent: true,
      },
    });
    return user;
  }
}
