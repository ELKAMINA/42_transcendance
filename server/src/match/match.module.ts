import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  providers: [MatchService, UserService],
  controllers: [MatchController],
})
export class MatchModule {}
