import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Body,
} from '@nestjs/common';
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
    try {
      let requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      let toBan;
      let toMute;
      let activate = false;
      let concernedchannel;

      /* Getting the request  */
      const request = context.switchToHttp().getRequest();

      /* Checking required roles  */
      if (!requiredRoles && !request.route.path.includes('/replaceMembers')) {
        return true;
      } else if (
        !requiredRoles &&
        request.route.path.includes('/replaceMembers')
      ) {
        const { action } = request.body;
        if (action === 'leave') requiredRoles = ['not owner'];
        else requiredRoles = ['admin'];
      }

      /* Getting channel name depending on arg received */
      if (request.route.path.includes('/checkPwd')) {
        concernedchannel = request.body.obj.name;
      }
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

      /* Getting user from cookie */
      const userFromCookie = this.getUserInfoFromSocket(request.headers.cookie);
      const userFromDB = await this.userServ.searchUser(
        userFromCookie.nickname,
      );
      if (!userFromDB || !concernedchannel) return activate;

      /* Issue 111: a user cannot ban/mute itself */
      if (request.route.path.includes('/updateMuted')) {
        toMute = request.body.muted.some((e) => e === userFromDB.login);
        if (toMute) return false;
      }

      if (request.route.path.includes('/updateBanned')) {
        toBan = request.body.banned.some((e) => e === userFromDB.login);
        if (toBan) return false;
      }

      /* Logic for each role */
	  if (requiredRoles) {
		requiredRoles.map((role) => {
			switch (role) {
			  case 'admin':
				activate = userFromDB.adminChannels.some(
				  (chan) => chan.name === concernedchannel,
				);
				break;
			  case 'member':
				activate = userFromDB.channels.some(
				  (chan) => chan.name === concernedchannel,
				);
				break;
			  case 'owner':
				activate = userFromDB.ownedChannels.some(
				  (chan) => chan.name === concernedchannel,
				);
				break;
			  case 'not owner':
				activate = !userFromDB.ownedChannels.some(
				  (chan) => chan.name === concernedchannel,
				);
				break;
			  default:
				break;
			}
		  });
	  }
      return activate;
    } catch (e) {
      console.log('Oups, something went wrong with Roles');
    }
  }
}

/* Code explanation :
	1. Here, a class named RolesGuard is being declared and exported. 
	This class is implementing the CanActivate interface from NestJS, which means this class is a guard that has logic to decide if a certain action (like accessing a route) should proceed or not.
	
	2. The class has a constructor with one parameter, reflector, which is an instance of the Reflector class. The Reflector is a utility from NestJS that allows you to fetch metadata attached to classes or handlers. By marking reflector with private, it's also implicitly creating a private property for the class.

	3. This method canActivate is required by the CanActivate interface. It's where the guard's logic resides. This method takes in a single parameter, context, which is an ExecutionContext instance. This context provides details about the current request, response, handler, etc. The method returns a boolean indicating whether the current action (like accessing a route) should be allowed (true) or denied (false).

	4. Using the reflector utility, we're trying to fetch the roles metadata (previously set by the @Roles() decorator) attached to the current handler or class. The ROLES_KEY is the key used to store the roles metadata.

	5. *Step 5 means : If there are no requiredRoles attached as metadata, the guard will allow the action to proceed by returning true.

	6. This line switches the context to the HTTP context and then fetches the current HTTP request object. This allows access to request-specific properties, like headers, body, params, and user (often attached by authentication middleware).*/
