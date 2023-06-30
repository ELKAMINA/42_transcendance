import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtService } from '@nestjs/jwt';
import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import HomeModule from './profile/home.module';
import { AtGuard } from './guards/at-auth.guard';
import PrismaModule from './prisma/prisma.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { FriendshipModule } from './friendship/friendship.module';
import { FriendshipGateway } from './friendship/friendship.gateway';
import channelModule from './channel/channel.module';
import { ChannelService } from './channel/channel.service';
import { ChatGateway } from './chat/gateway/chat.gateway';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // To make the config Module global to all the app
    }),
    AuthModule,
    UserModule,
	channelModule,
    PrismaModule,
    HomeModule,
    PassportModule.register({}),
    FriendshipModule,
     // j'ai enlevé session:true
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard, // This is done to inject the reflector as we're using the At Guard as a global decorator
    },
    AuthService,
    UserService,
	ChannelService,
    JwtService,
	ChatGateway,
	ChatService,
  ],
})
export default class AppModule {}
