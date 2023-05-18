import { ExecutionContext, Injectable, Body, CanActivate, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// Keyword : Interceptor - Execution Context :  is an object that provides methods to access the route handler and class that can be called or invoked
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
    constructor(){
        super()
    }
}