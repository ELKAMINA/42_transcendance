import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, UserService]
})
export class GameModule {}
