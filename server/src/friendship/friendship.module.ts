import { Module } from '@nestjs/common';
import { FriendshipGateway } from './friendship.gateway';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipGateway, UserService, PrismaService],
})
export class FriendshipModule {}
