import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Keyword : Interceptor - Execution Context :  is an object that provides methods to access the route handler and class that can be called or invoked
@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    context.switchToHttp().getRequest();
    // console.log('La requete de 42 OAuthguard', request);
    return activate;
  }
}
