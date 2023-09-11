import {
  Req,
  Res,
  Get,
  UseGuards,
  Controller,
  Body,
  Post,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthDto, SignInDto } from './dto/auth.dto';
// import { UserTfaDto } from './dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { RtGuard } from '../guards/rt-guard';
import { Tokens } from './types/tokens-types';
import { OauthPayload } from './types/OauthPayload.type';
import { FtOauthGuard } from '../guards/42-oauth.guard';
import { GetCurrentUserOAuth } from '../decorators/get-user-Oauth.decorator';
import { GetCurrentUserId } from '../decorators/get-current-userId.decorator';
import { GetCurrentUser } from '../decorators/get-current-user.decorator';
import { User } from '@prisma/client';
import {
  authenticateDTO,
  cancelTfaDto,
  checkPwdDTO,
  turnOnTfaDto,
} from './dto';

@Controller('auth')
@ApiTags('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  /* Simple Login Strategy */

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('Signup')
  signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    return this.authService.signup(dto, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('Signin')
  @ApiOkResponse({ type: Tokens })
  signin(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    return this.authService.signin(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('Logout')
  @ApiOkResponse({ type: Tokens })
  logout(@GetCurrentUserId() userInfo: string) {
    return this.authService.logout(userInfo);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ type: Tokens }) //= > this is for Swagger
  async refresh(
    @GetCurrentUserId() userNick: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    // console.log('userNick ', userNick);
    // console.log('refresh token ', refreshToken);
    return this.authService.refresh(userNick, refreshToken);
  }
  /* ******************** */

  /* 42 Login Strategy */

  @Public()
  @Get('42/callback')
  @UseGuards(FtOauthGuard)
  async oAuthLogin() {
    return {};
  }

  @Public()
  @Get('42/redirect')
  @UseGuards(FtOauthGuard)
  //   @Redirect('http://localhost:3000/welcome')
  async oAuthRedirect(
    @GetCurrentUserOAuth() userInfo: OauthPayload,
    @Res({ passthrough: true }) res: Response,
    /* The passthrough: true make possible to use tha library-specific &&& the built-in concepts to manipulate the responses we define : Ref = https://docs.nestjs.com/controllers */
  ) {
    // console.log('userINFO ', userInfo);
    if (userInfo.provider === 'not42') {
      const error = 'error';
      res.redirect(`http://localhost:3000/?error=${error}`);
      return;
    } else if (userInfo.provider === 'double') {
      res.redirect('http://localhost:3000');
      return;
    }
    // console.log('user Info ', userInfo);

    await this.authService.findUser(userInfo, res);
  }
  /* ******************** */

  /* 2FA Strategy */
  //   @Public()
  @Post('2fa/generate')
  async register(@Res() response: Response, @Body() body: User) {
    const qrCode = await this.authService.generateTwoFactorAuthenticationSecret(
      body,
    );
    return response.json(qrCode);
  }

  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(
    @Body() body: turnOnTfaDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log('le body ', body);
    try {
      await this.authService.isTwoFactorAuthenticationCodeValid(
        body.TfaCode,
        body.actualUser.login,
        res,
      );
      await this.authService.turnOnTwoFactorAuthentication(
        body.actualUser.user_id,
      );
    } catch (e) {
      console.error('Invalid TFA Code'); // Mettre un message d'erreur côté Froonts
      throw e;
    }
  }

  @Public()
  @Post('checkPwd')
  @HttpCode(HttpStatus.OK)
  async checkPwdTfa(@Req() request, @Body() body: checkPwdDTO) {
    return await this.authService.checkingPwdBeforeTfa(body);
  }

  @Public()
  @Post('2fa/authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(
    @Req() request,
    @Body() body: authenticateDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    let payload = null;
    let validation;
    try {
      validation = await this.authService.isTwoFactorAuthenticationCodeValid(
        body.TfaCode,
        body.nickname,
        res,
      );
    } catch (e) {
      console.error('Invalid TFA code'); // Mettre un message d'erreur côté Froonts
      return e;
    }
    if (validation) {
      payload = await this.authService.loginWith2fa(body.nickname, res);
      return payload;
    }
  }

  @Public()
  @Post('2fa/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelTfa(@Body() body: cancelTfaDto) {
    await this.authService.cancelTfa(body.nickname);
  }

  @Public()
  @Post('update-cookie')
  updateCookie(@Body() newCookie, @Res({ passthrough: true }) res: Response) {
    this.authService.setCookie(newCookie, res);
  }
}
/* ******************** */
