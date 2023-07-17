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
import { User } from '@prisma/client';
import { Jwt2faAuthGuard } from 'src/guards/jwt-2fa-auth.guard';

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
		    avatar: infos.avatar,
      },
      res,
    );
    return infos;
  }
  /* ******************** */

  /* 2FA Strategy */
  @Public()
  @Post('2fa/generate')
  async register(@Res() response: Response, @Body() body: User) {
    // console.log('la request ', body)
    const qrCode = await this.authService.generateTwoFactorAuthenticationSecret(
      body,
    );
    return response.json(qrCode);
  }

  @Public()
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
    // console.log('le body ', body)
    this.authService.isTwoFactorAuthenticationCodeValid(
      body.TfaCode,
      body.actualUser.login,
    );
    this.authService.turnOnTwoFactorAuthentication(body.actualUser.user_id);
  }

  @Public()
  @Post('2fa/authenticate')
  @UseGuards(Jwt2faAuthGuard)
  @HttpCode(HttpStatus.OK)
  async authenticate(@Req() request, @Body() body, @Res({ passthrough: true }) res: Response) {
	console.log('la requete ', request)
    let payload = null;
    const validation = this.authService.isTwoFactorAuthenticationCodeValid(
      body.TfaCode,
      body.nickname,
    );
    if (validation){
      payload = await this.authService.loginWith2fa(body.nickname, res)
      // console.log('validation ', payload)
    }
    return payload;
      // return this.authService.loginWith2fa(body.nickname, res) 
  }

  @Public()
  @Post('2fa/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelTfa(@Body() body) {
    this.authService.cancelTfa(body.nickname)
  }

  @Public()
  @Post('update-cookie')
  updateCookie(@Body() newCookie, @Res() res: Response) {
    // console.log('new cookie ', newCookie);
    this.authService.setCookie(newCookie, res);
  }
}
/* ******************** */
