import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
 