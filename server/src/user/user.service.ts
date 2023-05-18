import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async searchUser(userId: string){
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          user_id: userId,
        },
      });
      return user;
    }
    catch{

    } 
  }
}
