import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userServ: UserService, private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN'),
    });
  }

  async validate(payload: any) {
	// console.log ('PAYLOAD ', payload)
    const user = await this.userServ.searchUser(payload.nickname);

	return user
    // if (!user.faEnabled) {
    //   return user;
    // }
    // if (payload.isTwoFactorAuthenticated) {
    //   return user;
    // }
  }
}
