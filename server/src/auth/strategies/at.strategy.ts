import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwtPayload.type';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN'),
    });
  }

  async validate(payload: JwtPayload) {
    // console.log("PAYLOAD", payload);
    return payload;
  }
}
