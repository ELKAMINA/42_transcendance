import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
