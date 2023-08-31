import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { toDataURL, toFileStream } from 'qrcode';
import { ConfigService } from '@nestjs/config';

import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { Payload2FA } from './types/payload2FA.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, OauthPayload, CookieType } from './types';
import { UserDetails } from '../user/types/user-types.user';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private userServ: UserService,
  ) {}

  async signTokens(userId: string, nickname: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          nickname,
        },
        {
          secret: this.config.get('ACCESS_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ), // access token
      this.jwt.signAsync(
        {
          sub: userId,
          nickname,
        },
        {
          secret: this.config.get('REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ), // refresh token
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signTokens2FA(payload: Payload2FA) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          login: payload.login,
          faEna: payload.faEnabled,
          authFa: !!payload.authTFA,
        },
        {
          secret: this.config.get('ACCESS_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ), // access token
      this.jwt.signAsync(
        {
          login: payload.login,
          faEna: payload.faEnabled,
          authFa: !!payload.authTFA,
        },
        {
          secret: this.config.get('REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ), // refresh token
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        rtHash: hash,
      },
    });
  }

  async verifyJwt(jwt: string): Promise<any> {
    const verification = this.jwt.verifyAsync(jwt, {
      secret: this.config.get('ACCESS_TOKEN'),
      maxAge: 60 * 15,
    });
    return verification;
  }

  async setCookie(data: object, res: Response) {
    const serializeData = JSON.stringify(data);
    // console.log("serialized data for cookie ", serializeData)
    // res.cookie('Authcookie', '', { expires: new Date(0) });
    res.cookie('Authcookie', serializeData, {
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
      maxAge: 1800000000,
      domain: 'localhost',
      path: '/',
    });
  }

  async signup(dto: AuthDto, res: Response): Promise<object> {
    const pwd = await argon.hash(dto.password);
    // console.log('dto', dto)
    try {
      const nbUsers = await this.prisma.user.count();
      const user = await this.prisma.user.create({
        data: {
          login: dto.nickname,
          hash: pwd,
          avatar: dto.avatar,
          status: 'Online',
          rank: nbUsers + 1,
          provider: 'not42',
        },
      });
      if (dto.avatar === '') {
        await this.prisma.user.update({
          where: { login: user.login },
          data: {
            avatar:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUKXpZECK0fPRdVpTN1mP828iGNWf8Apne_NMRYM66k9sPfY3Ehbux1vzlOOOPLOzkM0&usqp=CAU',
          },
        });
      }
      const tokens = await this.signTokens(user.user_id, user.login);
      await this.updateRtHash(user.user_id, tokens.refresh_token);
      this.setCookie(
        {
          nickname: dto.nickname,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          // avatar: user.avatar,
        },
        res,
      );
      return { faEnabled: user.faEnabled, tokens, avatar: user.avatar };
    } catch (error: any) {
      if (
        error.constructor.name === Prisma.PrismaClientKnownRequestError.name
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      // console.log('la ????');
      throw error;
    } // PrismaClientKnownRequestError to catch the unique prisma duplicate error (for instance for the email that is duplicated )
  }

  async signin(dto: AuthDto, res: Response): Promise<object> {
    try {
      // console.log('DTOOOO ', dto);
      const us = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: dto.nickname,
        },
      });
      // console.log('le user Vincent ', us);
      if (us) {
        await this.prisma.user.update({
          where: {
            login: dto.nickname,
          },
          data: { status: 'Online' },
        });
      }
      if (dto.type === 'notTfa') {
        if (
          us &&
          us.hash &&
          dto.password &&
          (await argon.verify(us.hash, dto.password)) === false
        ) {
          throw new HttpException('Invalid Password', HttpStatus.FORBIDDEN);
        }
      }
      if (us.avatar !== dto.avatar && dto.avatar !== '') {
        await this.prisma.user.update({
          where: {
            login: dto.nickname,
          },
          data: {
            avatar: dto.avatar,
          },
        });
      }
      const tokens = await this.signTokens(us.user_id, us.login);
      await this.updateRtHash(us.user_id, tokens.refresh_token);
      this.setCookie(
        {
          nickname: us.login,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
        res,
      );
      return { faEnabled: us.faEnabled, tokens, avatar: us.avatar };
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new HttpException('No user found', HttpStatus.FORBIDDEN);
      }
      throw e;
    }
  }

  async logout(userInfo: string) {
    // console.log('userInfo, userInfo', userInfo)
    await this.prisma.user.updateMany({
      where: {
        login: userInfo,
        rtHash: {
          not: null,
        },
      },
      data: {
        rtHash: null,
        status: 'Offline',
      },
    });
  }

  async refresh(userNick: string, refreshToken: string) {
    const us = await this.prisma.user.findUnique({
      where: {
        login: userNick,
      },
    });
    if (!us || !us.rtHash) throw new ForbiddenException('1 - Access Denied');
    const rtMatches = await argon.verify(us.rtHash, refreshToken);
    if (rtMatches == false) throw new ForbiddenException('2 - Access Denied');
    const tokens = await this.signTokens(us.user_id, us.login);
    await this.updateRtHash(us.user_id, tokens.refresh_token);
    return tokens;
  }

  async validateUser(details: UserDetails) {
    const us = await this.prisma.user.findUnique({
      where: {
        login: details.login,
      },
      // rejectOnNotFound: true,
    });
    if (us) {
      delete us.hash;
      delete us.fA;
      delete us.email;
      delete us.rtHash;
      return us;
    }
    const newUser = await this.prisma.user.create({
      data: {
        login: details.login,
        email: details.email,
        avatar: details.avatar,
      },
    });
    delete newUser.hash;
    delete newUser.fA;
    delete newUser.email;
    delete newUser.rtHash;
    return newUser;
  }

  async findUser(userInfo: OauthPayload, res: Response) {
    // console.log('user info ', userInfo);
    const user = await this.userServ.searchUser(userInfo.login);
    if (!user.faEnabled) {
      const tokens = await this.signTokens(user.user_id, user.login);
      this.updateRtHash(user.user_id, tokens.refresh_token);
      if (user.provider === '42') {
        this.setCookie(
          {
            nickname: user.login,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            avatar: user.avatar,
          },
          res,
        );
      } else if (user.provider === '42-updated') {
        this.setCookie(
          {
            nickname: user.login,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            //   avatar: user.avatar,
          },
          res,
        );
      }
      return res.redirect('http://localhost:3000/welcome');
    } else {
      const url = `http://localhost:3000/tfa?param1=${user.login}`;
      res.redirect(url);
    }
  }

  // 2FA Authentication **********************************************************************

  // ****** Settings by the user ******************
  async turnOnTwoFactorAuthentication(userId: string) {
    // Once the user is signed up, we need to verify if he has the 2FA, if he modifies his settings to turn it on, we need to update the db
    await this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        faEnabled: true,
      },
    });
  }

  async checkingPwdBeforeTfa(body) {
    // console.log('body ', body)
    const user = await this.prisma.user.findUnique({
      where: { login: body.nickname },
    });
    // console.log('user ', user)
    if (user && user.hash) {
      if ((await argon.verify(user.hash, body.password)) === false)
        throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }
  }

  async isTwoFactorAuthenticationCodeValid(
    TfaCode: string,
    user: string,
    res: Response,
  ) {
    // verify the authentication code with the user's secret
    const us = await this.prisma.user.findUnique({
      where: { login: user },
    });
    const verif = await authenticator.check(TfaCode, us.fA);
    if (!verif) {
      throw new ForbiddenException('Wrong authentication code');
    }
    return verif;
  }

  // The very first thing is to create a secret key unique for every user
  async generateTwoFactorAuthenticationSecret(user: User) {
    // generate the secret and otpAuthUrl. The AUTH_APP_NAME is the name that will appear in the google authenticator app.
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.login,
      this.config.get('2FA_APP_NAME'),
      secret,
    ); // One Time Password
    await this.setTwoFactorAuthenticationSecret(secret, {
      login: user.login,
      id: user.user_id,
      provider: user.provider,
    });
    const qrCode = await this.generateQrCodeDataURL(otpauthUrl);
    return qrCode;
  }

  async setTwoFactorAuthenticationSecret(
    secret: string,
    userInfo: OauthPayload,
  ) {
    // Update the user with the authnetication 2FA secret
    await this.prisma.user.update({
      where: {
        login: userInfo.login,
      },
      data: {
        fA: secret,
      },
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    // generate the QrCode that will be used to add our application to the google authenticator app.
    return toDataURL(otpAuthUrl);
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  // ****** Authentication 2FA ******************
  async loginWith2fa(user: string, res: Response): Promise<object> {
    try {
      const usr = await this.userServ.searchUser(user);
      return await this.signin(
        {
          nickname: usr.login,
          password: usr.hash,
          avatar: usr.avatar,
          type: 'tfa',
        },
        res,
      );
    } catch (e) {
      console.log('Logging with 2FA has failed');
    }
  }

  async cancelTfa(nickname: string) {
    await this.prisma.user.update({
      where: {
        login: nickname,
      },
      data: {
        fA: '',
        faEnabled: false,
      },
    });
  }
}
