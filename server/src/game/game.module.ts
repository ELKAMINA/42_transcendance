import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserService } from '../user/user.service';
import { FriendshipGateway } from '../friendship/friendship.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from '../friendship/friendship.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, UserService, FriendshipGateway, PrismaService, AuthService, ConfigService, JwtService, FriendshipService]
})
export class GameModule {}
