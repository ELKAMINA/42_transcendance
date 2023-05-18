import { Payload2FA } from './types/payload2FA.dto';
import { UserDetails } from '../user/types/user-types.user';
import { AuthDto } from './dto/auth.dto';
import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError} from '@prisma/client/runtime';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime';
import { Prisma, User } from '@prisma/client';
import { JwtPayload, OauthPayload, Tokens } from './types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Res } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserService } from 'src/user/user.service';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService, private userServ: UserService) {}

  async signTokens(userId: string, nickname: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          nickname,
        },
        {
          secret: this.config.get('ACCESS_TOKEN'),
          expiresIn: 60 * 0.5,
        },
      ), //access token
      this.jwt.signAsync(
        {
          sub: userId,
          nickname,
        },
        {
          secret: this.config.get('REFRESH_TOKEN'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ), //refresh token
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
      ), //access token
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
      ), //refresh token
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

  async signup(dto: AuthDto): Promise<object> {
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
      // console.log(tokens);
      return {faEnabled: user.faEnabled, tokens: tokens};
    }
    catch (error: any) {
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

  async signin(dto: AuthDto): Promise<object> {
    try{
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: dto.nickname,
        },
      });
      if ((user && await argon.verify(user.hash, dto.password) == false)) {
        throw new HttpException('Invalid Password', HttpStatus.FORBIDDEN);
      }
      const tokens = await this.signTokens(user.user_id, user.login);
      await this.updateRtHash(user.user_id, tokens.refresh_token);
      return {faEnabled: user.faEnabled, tokens: tokens};
    }
    catch(e: any)
    {
      if (e.code === 'P2025'){
        throw new HttpException('No user found', HttpStatus.FORBIDDEN);
      }
      throw e;
    }
   }

   async logout(userInfo: JwtPayload) {
    try{
      const user = await this.prisma.user.updateMany({
        where: {
          user_id : userInfo.sub,
          rtHash: {
            not: null
          },
        },
        data: {
          rtHash: null,
        }
        
      })
  } catch(e: any){
    // console.log("errreur ", e);

  }
  return {msg: 'OK'};
  }

  async refresh(userInfo: JwtPayload, refreshToken: string){
    try{
      const user = await this.prisma.user.findUnique({
        where: {
          user_id : userInfo.sub,
        },
      })
      if (!user || !user.rtHash)
        throw new ForbiddenException("Access Denied");
      const rtMatches = await argon.verify(user.rtHash, refreshToken);
      if (rtMatches == false)
        throw new ForbiddenException("Access Denied");
      const tokens = await this.signTokens(user.user_id, user.login);
      await this.updateRtHash(user.user_id, tokens.refresh_token);
      return tokens;
    } catch(e: any){
      // console.log("errreur 2 ", e);

    }
  }

  async validateUser(details: UserDetails) {
    const user =  await this.prisma.user.findUnique({
      where: {
        login: details.login,
      },
    });
    if (user) {
      return user;
    } else {
      const newUser =  await this.prisma.user.create({
        data: {
          login: details.login,
          email: details.email,
          avatar: details.avatar,
        },
      })
      return newUser;
    }
  }

  async findUser(userInfo: OauthPayload) {
    const user = await this.userServ.searchUser(userInfo.id);
    const tokens =  await this.signTokens(user.user_id, user.login);
    this.updateRtHash(user.user_id, tokens.refresh_token);
    return {user: user.login, access_token: tokens.access_token, refresh_token: tokens.refresh_token};
  }

  // 2FA Authentication **********************************************************************

  // ****** Settings by the user ******************
  async turnOnTwoFactorAuthentication(userId: string) {// Once the user is signed up, we need to verify if he has the 2FA, if he modifies his settings to turn it on, we need to update the db
    const user = await this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        faEnabled: true,
      },
    });
  }

  async isTwoFactorAuthenticationCodeValid(TfaCode: string, user: JwtPayload) { // verify the authentication code with the user's secret
    const us = await this.userServ.searchUser(user.sub);
    return authenticator.verify({
      token: TfaCode,
      secret: us.fA,
    });
  }

  //The very first thing is to create a secret key unique for every user
  async generateTwoFactorAuthenticationSecret(user: JwtPayload) { // generate the secret and otpAuthUrl. The AUTH_APP_NAME is the name that will appear in the google authenticator app.
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.nickname, this.config.get('2FA_APP_NAME'), secret); // One Time Password
    await this.setTwoFactorAuthenticationSecret(secret, {login: user.nickname, id: user.sub});
    return {
      secret,
      otpauthUrl
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userInfo: OauthPayload) { // Update the user with the authnetication 2FA secret
    const user = await this.prisma.user.update({
      where: {
        user_id: userInfo.id,
      },
      data: {
        fA: secret,
      },
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) { // generate the QrCode that will be used to add our application to the google authenticator app.
    return toDataURL(otpAuthUrl);
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

   // ****** Authentication 2FA ******************
   async loginWith2fa(user: JwtPayload) {
    const usr = await this.userServ.searchUser(user.sub);
    const payload = {
      login: usr.login,
      faEnabled: usr.faEnabled,
      authTFA: true,
    }
    const tokens = await this.signTokens2FA(payload);
    await this.updateRtHash(usr.user_id, tokens.refresh_token);
    return {
      login: payload.login,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

}