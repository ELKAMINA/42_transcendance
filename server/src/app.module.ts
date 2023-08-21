import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtService } from '@nestjs/jwt';
import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import { AtGuard } from './guards/at-auth.guard';
import PrismaModule from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { FriendshipModule } from './friendship/friendship.module';
import channelModule, {
  BannedSchedulerModule,
  MuteSchedulerModule,
} from './channel/channel.module';
import { ChannelService } from './channel/channel.service';
import { ChatGateway } from './chat/gateway/chat.gateway';
import { ChatService } from './chat/chat.service';
import { GlobalController } from './global/global.controller';
import { GlobalService } from './global/global.service';
import { GlobalModule } from './global/global.module';
import { ProfileGateway } from './profile/home.gateway';
import { HomeService } from './profile/home.service';
import { FriendshipService } from './friendship/friendship.service';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // To make the config Module global to all the app
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    channelModule,
    PrismaModule,
    PassportModule.register({}),
    FriendshipModule,
    GlobalModule,
    GameModule,
    ChatModule,
  ],
  controllers: [GlobalController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard, // This is done to inject the reflector as we're using the At Guard as a global decorator
    },
    AuthService,
    UserService,
    ChannelService,
    MuteSchedulerModule,
    BannedSchedulerModule,
    JwtService,
    // ChatGateway,
    ProfileGateway,
    ChatService,
    HomeService,
    GlobalService,
    FriendshipService,
  ],
})
export default class AppModule {}
