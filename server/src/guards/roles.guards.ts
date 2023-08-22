import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';
import { parse } from 'cookie';

import { ROLES_KEY } from 'src/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userServ: UserService) {}

  getUserInfoFromSocket(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    // console.log('[Guard ---- Required roles] ', requiredRoles);
    // console.log('[Guard ---- path asked] ', request.route.path);
    // console.log('request ');
    if (!requiredRoles && !request.route.path.includes('/replaceMembers')) {
      // Step 5
      // console.log('Required roles CONDITION ', requiredRoles);
      return true;
    } else if (
      !requiredRoles &&
      request.route.path.includes('/replaceMembers')
    ) {
      const { action } = request.body;
      if (action === 'leave') requiredRoles = ['member'];
      else requiredRoles = ['admin'];
    }
    // console.log('Requests ', request);
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
    // console.log('concerned Channel ', concernedchannel);

    const userFromCookie = this.getUserInfoFromSocket(request.headers.cookie);
    const userFromDB = await this.userServ.searchUser(userFromCookie.nickname);
    if (!userFromDB || !concernedchannel) return activate;
    console.log('[ Required roles ] ', requiredRoles);
    console.log('1----[ ]: Channel concerned ', concernedchannel);
    console.log('[]: User concerned ', userFromDB.login);
    switch (requiredRoles[0]) {
      case 'admin':
        activate = userFromDB.adminChannels.some(
          (chan) => chan.name === concernedchannel,
        );
        console.log('ADMIN = [Guard ---- path asked] ', request.route.path);
        break;
      case 'member':
        console.log(
          '[Guard] --- Role: member : Channels C user',
          userFromDB.channels,
        );
        console.log(
          '2----[From member ]: Channel concerned ',
          concernedchannel,
        );
        console.log('[From member ]: User concerned ', userFromDB.login);
        console.log('MEMBER = [Guard ---- path asked] ', request.route.path);
        activate = userFromDB.channels.some(
          (chan) => chan.name === concernedchannel,
        );
        break;
      case 'owner':
        activate = userFromDB.ownedChannels.some(
          (chan) => chan.name === concernedchannel,
        );
        console.log('MEMBER = [Guard ---- path asked] ', request.route.path);
        console.log('[Guard] --- OWNER : activate ', activate);
        break;
      default:
        break;
    }
    console.log('[Guard ] --- Final result : activate: ', activate);
    return activate;
  }
}

/* Code explanation :
	1. Here, a class named RolesGuard is being declared and exported. 
	This class is implementing the CanActivate interface from NestJS, which means this class is a guard that has logic to decide if a certain action (like accessing a route) should proceed or not.
	
	2. The class has a constructor with one parameter, reflector, which is an instance of the Reflector class. The Reflector is a utility from NestJS that allows you to fetch metadata attached to classes or handlers. By marking reflector with private, it's also implicitly creating a private property for the class.

	3. This method canActivate is required by the CanActivate interface. It's where the guard's logic resides. This method takes in a single parameter, context, which is an ExecutionContext instance. This context provides details about the current request, response, handler, etc. The method returns a boolean indicating whether the current action (like accessing a route) should be allowed (true) or denied (false).

	4. Using the reflector utility, we're trying to fetch the roles metadata (previously set by the @Roles() decorator) attached to the current handler or class. The ROLES_KEY is the key used to store the roles metadata.

	5. *Step 5 means : If there are no requiredRoles attached as metadata, the guard will allow the action to proceed by returning true.

	6. This line switches the context to the HTTP context and then fetches the current HTTP request object. This allows access to request-specific properties, like headers, body, params, and user (often attached by authentication middleware).
*/
