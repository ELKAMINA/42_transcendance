import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError} from '@prisma/client/runtime';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';
// import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Response } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HomeService {
  constructor() {}
}
