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
import { Prisma } from '@prisma/client';
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
          expiresIn: 60 * 0.2,
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
          expiresIn: 60 * 20,
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
    console.log("seriiialized data ", serializeData)
    // console.log("la data ",data);
    res.cookie('Authcookie', '', { expires: new Date(0) });
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
    try {
      const user = await this.prisma.user.create({
        data: {
          login: dto.nickname,
          hash: pwd,
          avatar: dto.avatar,
        },
      });
      // console.log("user ", user);
      const tokens = await this.signTokens(user.user_id, user.login);
      await this.updateRtHash(user.user_id, tokens.refresh_token);
      this.setCookie(
        {
          nickname: dto.nickname,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
        res,
      );
      return { faEnabled: user.faEnabled, tokens };
    } catch (error: any) {
      if (
        error.constructor.name === Prisma.PrismaClientKnownRequestError.name
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    } // PrismaClientKnownRequestError to catch the unique prisma duplicate error (for instance for the email that is duplicated )
  }

  async signin(dto: AuthDto, res: Response): Promise<object> {
    try {
      const us = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: dto.nickname,
        },
      });
      if (us && (await argon.verify(us.hash, dto.password)) == false) {
        throw new HttpException('Invalid Password', HttpStatus.FORBIDDEN);
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
      return { faEnabled: us.faEnabled, tokens };
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new HttpException('No user found', HttpStatus.FORBIDDEN);
      }
      throw e;
    }
  }

  async logout(userInfo: JwtPayload) {
    await this.prisma.user.updateMany({
      where: {
        user_id: userInfo.sub,
        rtHash: {
          not: null,
        },
      },
      data: {
        rtHash: null,
      },
    });
    // res.clearCookie('Authcookie', { path: '/' });
  }

  async refresh(userNick: string, refreshToken: string) {
    const us = await this.prisma.user.findUnique({
      where: {
        login: userNick,
      },
    });
    // console.log('le user qui se co ', us);
    if (!us || !us.rtHash) throw new ForbiddenException('1 - Access Denied');
    const rtMatches = await argon.verify(us.rtHash, refreshToken);
    if (rtMatches == false) throw new ForbiddenException('2 - Access Denied');
    const tokens = await this.signTokens(us.user_id, us.login);
    await this.updateRtHash(us.user_id, tokens.refresh_token);
    console.log('les tookens from refresh function ', tokens);
    return tokens;
  }

  async validateUser(details: UserDetails) {
    const us = await this.prisma.user.findUnique({
      where: {
        login: details.login,
      },
      rejectOnNotFound: true,
    });
    if (us) {
      return us;
    }
    const newUser = await this.prisma.user.create({
      data: {
        login: details.login,
        email: details.email,
        avatar: details.avatar,
      },
    });
    return newUser;
  }

  async findUser(userInfo: OauthPayload) {
    const user = await this.userServ.searchUser(userInfo.login);
    const tokens = await this.signTokens(user.user_id, user.login);
    this.updateRtHash(user.user_id, tokens.refresh_token);
    return {
      user: user.login,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
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

  async isTwoFactorAuthenticationCodeValid(TfaCode: string, user: JwtPayload) {
    // verify the authentication code with the user's secret
    try {
      const us = await this.userServ.searchUser(user.nickname);
      const verif = authenticator.verify({
        token: TfaCode,
        secret: us.fA,
      });
      if (!verif) {
        throw new UnauthorizedException('Wrong authentication code');
      }
    } catch (e: any) {
      // console.log(e);
    }
  }

  // The very first thing is to create a secret key unique for every user
  async generateTwoFactorAuthenticationSecret(user: JwtPayload) {
    // generate the secret and otpAuthUrl. The AUTH_APP_NAME is the name that will appear in the google authenticator app.
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.nickname,
      this.config.get('2FA_APP_NAME'),
      secret,
    ); // One Time Password
    await this.setTwoFactorAuthenticationSecret(secret, {
      login: user.nickname,
      id: user.sub,
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
  async loginWith2fa(user: JwtPayload) {
    const usr = await this.userServ.searchUser(user.nickname);
    const payload = {
      login: usr.login,
      faEnabled: usr.faEnabled,
      authTFA: true,
    };
    const tokens = await this.signTokens2FA(payload);
    await this.updateRtHash(usr.user_id, tokens.refresh_token);
    return {
      login: payload.login,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

}
