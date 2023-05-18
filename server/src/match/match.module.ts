import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [MatchService, UserService],
  controllers: [MatchController]
})
export class MatchModule {}
