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
  Redirect,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthDto } from './dto/auth.dto';
import { JwtPayload } from './types/jwtPayload.type';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { RtGuard } from '../guards/rt-guard';
import { Tokens } from './types/tokens-types';
import { OauthPayload } from './types/OauthPayload.type';
import { FtOauthGuard } from '../guards/42-oauth.guard';
import { GetCurrentUserOAuth } from '../decorators/get-user-Oauth.decorator';
import { GetCurrentUserId } from '../decorators/get-current-userId.decorator';
import { GetCurrentUser } from '../decorators/get-current-user.decorator';

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
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    return this.authService.signin(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('Logout')
  @ApiOkResponse({ type: Tokens })
  logout(@GetCurrentUserId() userInfo: JwtPayload) {
    return this.authService.logout(userInfo);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse({ type: Tokens }) //= > this is for Swagger
  async refresh(
    @GetCurrentUserId() userInfo: JwtPayload,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(userInfo, refreshToken);
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
  @Redirect('http://localhost:3000/welcome')
  async oAuthRedirect(
    @GetCurrentUserOAuth() userInfo: OauthPayload,
    @Res({ passthrough: true }) res: Response,
    /* The passthrough: true make possible to use tha library-specific &&& the built-in concepts to manipulate the responses we define : Ref = https://docs.nestjs.com/controllers */
  ) {
    const infos = await this.authService.findUser(userInfo);
    this.authService.setCookie(
      {
        nickname: infos.user,
        accessToken: infos.accessToken,
        refreshToken: infos.refreshToken,
      },
      res,
    );
    return infos;
  }
  /* ******************** */

  /* 2FA Strategy */

  @Post('2fa/generate')
  async register(@Res() response: Response, @Req() request) {
    const qrCode = await this.authService.generateTwoFactorAuthenticationSecret(
      request.user,
    );
    return response.json(qrCode);
  }

  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    this.authService.isTwoFactorAuthenticationCodeValid(
      body.TfaCode,
      request.user,
    );
    this.authService.turnOnTwoFactorAuthentication(request.user.sub);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  async authenticate(@Req() request, @Body() body) {
    this.authService.isTwoFactorAuthenticationCodeValid(
      body.TfaCode,
      request.user,
    );
    return this.authService.loginWith2fa(request.user);
  }
}
/* ******************** */
