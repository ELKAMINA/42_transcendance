import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { FriendshipGateway } from './friendship.gateway';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [FriendshipController],
  providers: [
    FriendshipService,
    FriendshipGateway,
    UserService,
    PrismaService,
    AuthService,
    JwtService,
  ],
})
export class FriendshipModule {}
