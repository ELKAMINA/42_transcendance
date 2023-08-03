import { GameGateway } from './game.gateway';
import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from 'src/friendship/friendship.service';

@Module({
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    UserService,
    PrismaService,
    AuthService,
    ConfigService,
    JwtService,
    FriendshipService,
  ],
})
export class GameModule {}
