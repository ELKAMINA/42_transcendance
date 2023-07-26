import { Injectable } from '@nestjs/common';
import { gameDto } from './dto/game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async matchCreation(roomInfos: gameDto) {
    console.log('roomInfos at the end of the game', roomInfos);
    let winner: string;
    if (roomInfos.scorePlayers[0] > roomInfos.scorePlayers[1]) {
      this.userService.updateUserGameStat(
        roomInfos.players[0],
        true,
        roomInfos.scorePlayers[0],
      );
      this.userService.updateUserGameStat(
        roomInfos.players[1],
        false,
        roomInfos.scorePlayers[1],
      );
      winner = roomInfos.players[0];
    } else {
      this.userService.updateUserGameStat(
        roomInfos.players[0],
        false,
        roomInfos.scorePlayers[0],
      );
      this.userService.updateUserGameStat(
        roomInfos.players[1],
        true,
        roomInfos.scorePlayers[1],
      );
      winner = roomInfos.players[1];
    }
    const match = await this.prisma.match.create({
      data: {
        createdAt: roomInfos.createdDate,
        player1Id: roomInfos.players[0],
        player2Id: roomInfos.players[1],
        p1_score: roomInfos.scorePlayers[0],
        p2_score: roomInfos.scorePlayers[1],
        winnerName: winner,
      },
    });
    // await this.userService.updateRankOfAllUsers();
  }

  async getLeaderBoard() {
    const leaderBoard = await this.prisma.user.findMany({
      orderBy: {
        level: 'desc',
        login: 'asc',
      },
      select: {
        avatar: true,
        login: true,
        totalMatches: true,
        totalWins: true,
        totalloss: true,
        level: true,
      },
    });
    console.log('leaderboard ', leaderBoard);
    return leaderBoard;
  }
}
