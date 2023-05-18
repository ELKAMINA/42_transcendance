import { createParamDecorator, ExecutionContext, Body } from '@nestjs/common';
import { JwtPayload } from '../auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user;
  },
);
