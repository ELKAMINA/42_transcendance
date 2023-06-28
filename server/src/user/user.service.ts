import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
