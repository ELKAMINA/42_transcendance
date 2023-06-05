import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes my prisma Module global. To use with User/AUth/and other modules if needed
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule {}
