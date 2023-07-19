import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import AuthController from './auth.controller';
import { UserService } from '../user/user.service';
import { AtStrategy, RtStrategy } from './strategies';
import { FtStrategy } from './strategies/42.strategy';
import { Jwt2faStrategy } from './strategies/jwt-2fa.strategy';

@Module({
  // What's inside the module is called Metadata
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, FtStrategy, UserService, AtStrategy, RtStrategy, Jwt2faStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
