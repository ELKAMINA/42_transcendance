import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtPayload } from '../auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user.nickname;
    // console.log(user);
    return user;
  },
);
