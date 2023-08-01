import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HomeService } from './home.service';
import { ProfileGateway } from './home.gateway';
import { HomeController } from './home.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { FriendshipService } from '../friendship/friendship.service';


@Module({
  imports: [],
  providers: [HomeService,ProfileGateway, FriendshipService,
    UserService,
    PrismaService,
    AuthService,
    JwtService,],
  controllers: [HomeController],
})
export default class HomeModule {}
