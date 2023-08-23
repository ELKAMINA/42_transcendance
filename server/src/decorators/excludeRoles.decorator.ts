import { SetMetadata } from '@nestjs/common';

export const excludeRoles = (...roles: string[]) =>
  SetMetadata('excludeRoles', roles);
