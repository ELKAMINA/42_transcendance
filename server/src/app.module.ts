import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MatchModule } from './match/match.module';
import { ChannelModule } from './channel/channel.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { HomeModule } from './profile/home.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards/at-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // To make the config Module global to all the app
    }),
    AuthModule,
    UserModule,
    MatchModule,
    ChannelModule,
    PrismaModule,
    HomeModule,
    PassportModule.register({}), // j'ai enlevé session:true
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    }, // THis is done to inject the reflector as we're using the At Guard as a global decorator
  ],
})
export class AppModule {}
