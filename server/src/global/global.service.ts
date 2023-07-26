import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GlobalService {
  constructor(private prisma: PrismaService) {}

  async geTotalPlayer() {
    const resultat = await this.prisma.user.count();
    return resultat;
  }
}
