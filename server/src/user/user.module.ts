import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UserService, GameService, PrismaService],
  controllers: [UserController],
})
export default class UserModule {}
