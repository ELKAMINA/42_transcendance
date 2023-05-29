import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async searchUser(nick: string){
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: nick,
        },
      });
      return user;
    }
    catch{

    } 
  }
}
