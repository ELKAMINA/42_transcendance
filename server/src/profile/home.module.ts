import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [],
  providers: [HomeService],
  controllers: [HomeController],
})
export default class HomeModule {}
