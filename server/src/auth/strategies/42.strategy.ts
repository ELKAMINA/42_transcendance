import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException } from '@nestjs/common';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';
import { user } from '../test/stubs';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {
    super({
      clientID: config.get('FT_ID'),
      clientSecret: config.get('FT_SECRET'),
      callbackURL: 'http://localhost:4001/auth/42/redirect', // this is the redirect URI provided in 42 API
      passReqToCallBack: true, // allows us to pass back the entire request to the callback
      scopes: ['profile'], // the information we want to obtain from the user.
    });
  }

  async validate(
    accessToken: string, // useful to interact with 42 services
    refreshToken: string,
    profile: Profile, // Profile is an object with all the user informations
    cb: VerifyCallback, // a callback function where we will pass the user object and use it later to register it in the database and sign the JWT
  ): Promise<any> {
    try {
      //   console.log('profile', profile);
      const userDet = {
        provider: profile.provider,
        providerId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile._json.image.link,
        login: profile._json.login,
        userId: profile.id,
      };
      // console.log("je rentre ici 5,5 ??")
      let lolo = await this.prisma.user.findUnique({
        where: {
          user_id: userDet.userId,
        },
      });
      if (lolo) {
        // console.log('Lolo ', lolo);
        if (lolo.provider === 'not42') {
          return cb(null, lolo); // or use any other suitable exception class
        }
        lolo = await this.prisma.user.update({
          where: {
            user_id: userDet.userId,
          },
          data: { status: 'Online' },
        });
        //   console.log('Looool is already registered ???', lolo);
        return cb(null, lolo);
      } else if (!lolo) {
        let lala = await this.prisma.user.findUnique({
          where: {
            login: userDet.login,
          },
        });
        if (lala) {
          const upLala = await this.prisma.user.update({
            where: {
              login: userDet.login,
            },
            data: {
              provider: 'double',
            },
          });
          // console.log('LALA ', lala);
          return cb(null, upLala);
        }
      }
      const currentDate = new Date().toISOString();
      const newUser = await this.prisma.user.create({
        data: {
          user_id: userDet.userId,
          login: userDet.login,
          email: userDet.email,
          avatar: userDet.picture,
          faEnabled: false,
          status: 'Online',
          provider: userDet.provider,
          hash: await argon.hash(currentDate),
        },
      });
      // console.log('new User ', newUser);
      return cb(null, newUser);
    } catch (e) {
      console.log('An error occured when logging with OAuth');
    }
  }
}
