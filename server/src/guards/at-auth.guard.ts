import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

// Keyword : Interceptor - Execution Context :  is an object that provides methods to access the route handler and class that can be called or invoked
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    // getHandler, getClass means that you have to check if there is any metadata in the handler(the function : ex signin) if not, check in the class(globally)
    if (isPublic) {
      return true;
    }
    // console.log("canActivate = ", super.canActivate(context));
    // if not, check the canActivate with the jwt guard and return whatever it gives yo
    return super.canActivate(context);
  }
}
