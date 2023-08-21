import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OauthPayload } from '../auth/types';

export const GetCurrentUserOAuth = createParamDecorator(
  (data: OauthPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const infos = {
      user_id: request.user.user_id,
      login: request.user.login,
      email: request.user.email,
      avatar: request.user.avatar,
      provider: request.user.provider,
    };
    if (request.user) return infos;
    return request;
  },
);
