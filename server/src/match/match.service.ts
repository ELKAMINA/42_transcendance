import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { gameDto } from 'src/game/dto/game.dto';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}
}
