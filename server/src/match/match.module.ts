import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MatchService, UserService, PrismaService],
  controllers: [MatchController],
})
export class MatchModule {}
