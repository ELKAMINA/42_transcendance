import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
// import jwt from 'jsonwebtoken';
import { JwtPayload, JwtPayloadWithRt } from '../types';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_TOKEN'),
      passReqToCallback: true, // to refresh token, we need the acces token and its hash to get a refresh token, passReqToCallback make it possible before access token is destroyed (or expired...)
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}
