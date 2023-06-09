import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { send } from 'process';
import { UserUpdates } from './types';

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
    //   console.log(e);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
    //   console.log('all the users ', users);
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async getUserProfile(query: Record<string, any>){
    const { ProfileName } = query;
    const user = await this.searchUser(ProfileName);
    if (user) return user;
    else return null;
  }

  async updateUserInfo(userInfo: UserUpdates) {
    try {
        const user = await this.prisma.user.findUniqueOrThrow({
          where: {
            login: userInfo.oldNick,
          }
        })
        console.log('le user ', userInfo);
        // const {login, hash, avatar, email} = user
        if ((await argon.verify(user.hash, userInfo.pwd) == false) && userInfo.pwd != ''){
          const newHashedPwd = (await argon.hash(userInfo.pwd))
          const up1 = await this.prisma.user.update({
            where: {
              login: userInfo.oldNick,
            },
            data: {
              hash: newHashedPwd,
            }
          })
        }
        if (user.avatar != userInfo.atr && userInfo.atr != ''){
          const up2 = await this.prisma.user.update({
            where: {
              login: userInfo.oldNick,
            },
            data: {
              avatar: userInfo.atr,
            }
          })
        }
        if (user.email != userInfo.mail && userInfo.mail != ''){
          const up3 = await this.prisma.user.update({
            where: {
              login: userInfo.oldNick,
            },
            data: {
              email: userInfo.mail,
            }
          })
        }
        if (user.login != userInfo.login && userInfo.login != ''){
          const up4 = await this.prisma.user.update({
            where: {
              login: userInfo.oldNick,
            },
            data: {
              login: userInfo.login,
            }
          })
        }
        const finalUser = await this.prisma.user.findUnique({
          where: {
            login: userInfo.login,
          }
        })
        console.log('le user apres modif ', finalUser);
        return finalUser
    }
    catch(error: any){
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
  }
