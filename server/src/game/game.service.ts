import { Injectable } from '@nestjs/common';
import { GameDto } from './dto/game.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async matchCreation(roomInfos: GameDto) {
    // console.log(
    //   '[GATEWAY Service - matchCreation]',
    //   'Room at the end of the game',
    //   roomInfos,
    // );
    let winner: string;
    if (roomInfos.scorePlayers[0] > roomInfos.scorePlayers[1]) {
      await this.updateUserGameStat(
        roomInfos.players[0],
        true,
        roomInfos.scorePlayers[0],
      );
      await this.updateUserGameStat(
        roomInfos.players[1],
        false,
        roomInfos.scorePlayers[1],
      );
      winner = roomInfos.players[0];
    } else {
      await this.updateUserGameStat(
        roomInfos.players[0],
        false,
        roomInfos.scorePlayers[0],
      );
      await this.updateUserGameStat(
        roomInfos.players[1],
        true,
        roomInfos.scorePlayers[1],
      );
      winner = roomInfos.players[1];
    }
    await this.updateMatchHistory(roomInfos, winner);
    await this.updateRankOfAllUsers();
  }

  async getLeaderBoard() {
    const query = await this.prisma.user.findMany({
      orderBy: [
        {
          rank: 'asc',
        },
      ],
      select: {
        avatar: true,
        login: true,
        totalMatches: true,
        totalWins: true,
        totalloss: true,
        level: true,
        rank: true,
      },
    });
    // query.forEach((element) => {
    //   console.log('[GATEWAY - getLeaderBoard]','query element: ', element);
    // })
    return query;
  }

  async updateUserGameStat(player: string, iswinner: boolean, score: number) {
    try {
      const user = await this.prisma.user.update({
        where: { login: player },
        data: {
          totalMatches: { increment: 1 },
          totalWins: iswinner ? { increment: 1 } : { increment: 0 },
          totalloss: iswinner ? { increment: 0 } : { increment: 1 },
          level: { increment: score },
        },
      });
      //   console.log('user apres un game ', user);
    } catch (e) {
      console.error('[Game Service - updateUserGameStat]', 'Error: ', e);
    }
  }

  async updateMatchHistory(roomInfos: GameDto, winner: string) {
    try {
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
    } catch (e) {
      console.error('[Game Service - updateMatchHistory]', 'Error: ', e);
    }
  }

  // GET ALL USER GAME STATISTICS AND BY RESPECTING THE FOLLOWING RANKING RULES:
  // - PROMOTE THE USER WHO HAS THE MOST POINT, IF EQUALITY THEN
  //    -> PROMOTE THE USER WHO HAS THE LESS MATCH PLAYED (GOOD RATIO), IF EQUALITY THEN
  //      -> PROMOTE THE USER WHO HAS THE LESS MATCH PLAYED, IF EQUALITY THEN
  //        -> PROMOTE THE USER WHO HAS THE LESS LOSS MATCH PLAYED, IF EQUALITY THEN
  //            -> PROMOTE THE USER ACCORDING TO HIS NAME (SORRY GUYS AS: ZOE, ZORRO, ZELDA)
  async getUserGameStat() {
    const query = await this.prisma.user.findMany({
      orderBy: [
        {
          level: 'desc',
        },
        {
          totalMatches: 'asc',
        },
        {
          totalloss: 'asc',
        },
        {
          login: 'asc',
        },
      ],
      select: {
        avatar: false,
        login: true,
        totalMatches: true,
        totalWins: true,
        totalloss: true,
        level: true,
        rank: true,
      },
    });
    // console.log('[GATEWAY - getLeaderBoard]','leaderboard: ', leaderBoard);
    // query.forEach((element) => {
    //   console.log(
    //     '[GATEWAY Service - getUserGameStat]',
    //     'query element: ',
    //     element,
    //   );
    // });
    return query;
  }

  async updateRankOfAllUsers() {
    const sortedUsers = await this.getUserGameStat();
    // console.log('sorted Users ', sortedUsers);
    sortedUsers.forEach(async (element: any, index: number) => {
      try {
        await this.prisma.user.update({
          where: { login: element.login },
          data: { rank: index + 1 },
        });
      } catch (e) {
        console.error('[Game Service - updateRankOfAllUsers]', 'Error: ', e);
      }
    });
  }
}
