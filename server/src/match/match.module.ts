import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MatchService, UserService, PrismaService],
  controllers: [MatchController],
})
export class MatchModule {}
