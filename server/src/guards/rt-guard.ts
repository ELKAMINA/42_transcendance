import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Keyword : Interceptor - Execution Context :  is an object that provides methods to access the route handler and class that can be called or invoked
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {}
