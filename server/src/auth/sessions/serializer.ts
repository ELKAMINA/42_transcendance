/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService, private auth: AuthService) {
    super();
  }
  serializeUser(user: User, done: Function) { //to convert a user object into a session object
    console.log('Serialize the User', user);
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.auth.findUser(payload.id);
    // console.log('TOOOOO : je rentre ici', user);
    return user ? done(null, user) : done(null, null);
  }
}
