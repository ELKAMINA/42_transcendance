import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { fortyTwoStrategy } from './strategies/42.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
// import { SessionSerializer } from './sessions/serializer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AtStrategy, RtStrategy } from './strategies';
// import { SessionSerializer } from './Serializer';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, fortyTwoStrategy, UserService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
 