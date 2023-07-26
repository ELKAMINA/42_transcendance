import { Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('leaderboard')
  async getLeaderboard() {
    return this.gameService.getLeaderBoard();
  }
}
