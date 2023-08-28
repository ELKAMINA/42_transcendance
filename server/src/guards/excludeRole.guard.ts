import { parse } from 'cookie';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { excludeRoles } from 'src/decorators/excludeRoles.decorator';

@Injectable()
export class ExcludeRolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userServ: UserService) {}

  getUserInfoFromSocket(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let excludedRoles = this.reflector.getAllAndOverride<string[]>(
      excludeRoles,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest();

    if (!excludedRoles && !request.route.path.includes('/replaceMembers')) {
      // Step 5
      // console.log('Required roles CONDITION ', excludedRoles);
      return true;
    } else if (
      !excludedRoles &&
      request.route.path.includes('/replaceMembers')
    ) {
      const { action } = request.body;
      if (action === 'leave') excludedRoles = ['owner'];
      else return true;
    }

    let concernedchannel;
    let activate = false;
    if (request.body.channelName)
      concernedchannel = request.body.channelName.name;
    else if (request.body.name) {
      concernedchannel = request.body.name;
    }
    if (
      concernedchannel === 'WelcomeChannel' ||
      concernedchannel === 'empty channel'
    ) {
      return true;
    }
    const userFromCookie = this.getUserInfoFromSocket(request.headers.cookie);
    const userFromDB = await this.userServ.searchUser(userFromCookie.nickname);
    if (!userFromDB || !concernedchannel) return activate;
    // console.log('[ Excluded roles ] ', excludedRoles);
    // console.log('1----[ ]: Channel concerned ', concernedchannel);
    // console.log('[]: User concerned ', userFromDB.login);
    excludedRoles.map((excl) => {
      if (excl === 'owner') {
        activate = userFromDB.ownedChannels.some(
          (chan) => chan.name === concernedchannel,
        );
      }
    });

    // If excludedRoles is set to true, it would mean the roles listed are excluded from accessing the route. If a user with an excluded role tries to access the route, they should be denied access.
    // If it's set to false, then the roles listed are not excluded and hence can access the route. This behavior would be a bit counterintuitive given the naming, so a clear understanding of how it's implemented would be necessary.
    // console.log('[EXCLUDE ] --- Final result : activate: ', activate);

    // Check if user's role is in the excluded roles
    return activate;
  }
}
