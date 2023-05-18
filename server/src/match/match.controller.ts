import { Controller, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('match')
export class MatchController {
    constructor(private prisma: PrismaService, private user: UserService){}

    @Get('leaderboard')
    @UseGuards(AuthGuard('jwt'))
    getLeaderboard(){
        return "I'm the leaderboard";
    }

}
