import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, Injectable } from '@nestjs/common';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}
}
