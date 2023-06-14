import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import UserModule from './user/user.module';
import AuthModule from './auth/auth.module';
import { AtGuard } from './guards/at-auth.guard';
import HomeModule from './profile/home.module';
import PrismaModule from './prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { FriendshipGateway } from './friendship/friendship.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // To make the config Module global to all the app
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    HomeModule,
    PassportModule.register({}),
     // j'ai enlevé session:true
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard, // This is done to inject the reflector as we're using the At Guard as a global decorator
    },
    FriendshipGateway,
    AuthService,
    UserService,
    JwtService,
  ],
})
export default class AppModule {}
