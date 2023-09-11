import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';
import { parse } from 'cookie';

import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { SearchUserModel, UserModel } from 'src/user/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { all } from 'axios';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from '@prisma/client';

interface completeUserWithTime {
  us: any;
  ExpiryTime: string;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userServ: UserService,
    private prismaServ: PrismaService,
    private channelServ: ChannelService,
  ) {}

  getUserInfoFromSocket(cookie: string) {
    const { Authcookie: userInfo } = parse(cookie);
    const idAtRt = JSON.parse(userInfo);
    return idAtRt;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      /* Retrieving any metadata associated with the request (if any "@Roles() exists above the route ?") */
      let requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      /* Declaring some global variables: activate is the one 
      that gives access (if true) or not to the request */
      let activate = false;
      let concernedchannel;

      /* Getting the request from the context */
      const request = context.switchToHttp().getRequest();

      /* Checking which are the required roles and the path asked for 
      if any roles is required and the pathes don't match with these: Give access
      if not check if the path is : replaceMembers and check action (leave or kick)
      bc the same route manages 2 actions that requires differents roles
      */
      if (
        !requiredRoles &&
        !request.route.path.includes('/replaceMembers') &&
        !request.route.path.includes('/updateBanned') &&
        !request.route.path.includes('/updateMuted') &&
        !request.route.path.includes('/addMembers')
      ) {
        return true;
      } else if (
        !requiredRoles &&
        request.route.path.includes('/replaceMembers')
      ) {
        const { action } = request.body;
        if (action === 'leave') requiredRoles = ['not owner'];
      }

      /* Getting channel name depending on arguments received from the request */
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
      let userFromCookie;
      if (request.headers.cookie) {
        userFromCookie = this.getUserInfoFromSocket(request.headers.cookie);
      }
      const userFromDB = await this.userServ.searchUser(
        userFromCookie.nickname,
      );

      /* Protection : if either user or channel exists: activate is false */
      if (!userFromDB || !concernedchannel) return activate;

      /* Checking rights of the user doing the request */
      const amItheOwner = userFromDB.ownedChannels?.some(
        (e) => e.name === concernedchannel,
      );
      const amIAnAdmin = userFromDB.adminChannels?.some(
        (e) => e.name === concernedchannel,
      );

      /* Managing the addMembers path : No metadata bc 2 differents situtations 
      depending on the type of the channel */
      if (request.route.path.includes('/addMembers')) {
        const fullChannl : any = await this.channelServ.getDisplayedChannel(
          concernedchannel,
        );
        if (fullChannl.name) {
          if (fullChannl.type === 'public')
            return true /* if public, everyone can access */;
          else requiredRoles = ['admin']; /* else, only owners */
        }
      }

      /* Issue 111: a user cannot ban/mute itself:  */
      if (request.route.path.includes('/updateMuted')) {
        /* Creating a new array with the array of users that we want 
        to mute received from the request */
        let tomute = new Array<{ login: string; ExpiryTime: string }>(
          request.body.muted,
        );
		
		const checkingChannel : any = await this.channelServ.getDisplayedChannel(
			concernedchannel,
		);
		const currentlyMuted = checkingChannel.muted;

		let res = [];
		if (Array.isArray(res[0]) && res[0].length === 0) {
			tomute.forEach((user) => {
				// console.log('user = ', user);
				if (!currentlyMuted.some((m) => m.login === user.login)) {
					res.push(user);
				}
			})
			// console.log("res = ", res);
		}

		if (currentlyMuted.length > 0) {
			currentlyMuted.forEach((user) => {
				if (!tomute.some((m) => m.login === user.login)) {
					res.push(user);
				}
			})
		}
		
		const tmpSet = new Set(res);
		let totalUpdatedMuted = [...tmpSet];
				
        /* Checking if one of the user that we want to mute 
        is the user that has done the request? if so, we delete it from the array */
        totalUpdatedMuted = request.body.muted?.filter(
          (e) => e.login !== userFromDB.login,
        );
        /* if the user accesing the request is the owner, he has all rights */
        if (amItheOwner) return true;
        else {
          /* if the user accesing the request is the admin, he can muted other 
          users but not the owner or other admins */
          if (amIAnAdmin) {
            let lastArray = new Array<{ login: string; ExpiryTime: string }>();
            /* Getting only the list of users that we can mute depending on our roles:
              if admin : the users has to be members but not owners or admins
              lastArray = is the final array that contains only the one's that we can mute
            */
		//    console.log("lastArray = ", lastArray)
            lastArray = await this.getNewRequestBody(
				totalUpdatedMuted,
              concernedchannel,
              amItheOwner,
              amIAnAdmin,
            );
            /* Here we're changing the request with the newly array */
			if (lastArray.length === 0 && request.body.muted.length === 0) {
				return true;
			}

            request.body.muted = lastArray;

            if (lastArray.length > 0) return true;
            /* if last Array is empty, that means that we 
            don't have the required rights to mute the list 
            of users we received*/ else return false;
          }
        }
      }
      if (request.route.path.includes('/updateBanned')) {
        let toban = new Array<{ login: string; ExpiryTime: string }>(
          request.body.banned,
        );


		const checkingChannel : any = await this.channelServ.getDisplayedChannel(
			concernedchannel,
		);
		const currentlyBanned = checkingChannel.banned;

		let res = [];
		if (Array.isArray(res[0]) && res[0].length === 0) {
			toban.forEach((user) => {
				// console.log('user = ', user);
				if (!currentlyBanned.some((m) => m.login === user.login)) {
					res.push(user);
				}
			})
			// console.log("res = ", res);
		}

		if (currentlyBanned.length > 0) {
			currentlyBanned.forEach((user) => {
				if (!toban.some((m) => m.login === user.login)) {
					res.push(user);
				}
			})
		}
		
		const tmpSet = new Set(res);
		let totalUpdatedBanned = [...tmpSet];

		totalUpdatedBanned = request.body.banned?.filter(
			(e) => e.login !== userFromDB.login,
		  );

        if (amItheOwner) return true;
        else {
          if (amIAnAdmin) {
            let lastArray = new Array<{ login: string; ExpiryTime: string }>();
            lastArray = await this.getNewRequestBody(
				totalUpdatedBanned,
              concernedchannel,
              amItheOwner,
              amIAnAdmin,
            );

			if (lastArray.length === 0 && request.body.banned.length === 0) {
				return true;
			}
            request.body.banned = lastArray;

            if (lastArray.length > 0) return true;
            else return false;
          }
        }
      }

      /* Managing "kickig a user : if one the users that has 
      to kicked doesn't the conditions, all the request is 
      wrong and activate is false" */
      if (request.route.path.includes('/replaceMembers') && !requiredRoles) {
        const isItMe = request.body.tokickOrLeave?.some(
          (e) => e.login === userFromDB.login,
        );
        if (isItMe) return false;
        if (amItheOwner) return true;
        else {
          if (amIAnAdmin) {
            const lastArray = await this.kicking(
              request.body.tokickOrLeave,
              concernedchannel,
              amItheOwner,
              amIAnAdmin,
            );
            return lastArray;
          }
        }
      }

      /* Logic for each role, if any of the conditions has been evaluated*/

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
      console.log('Oups, something went wrong with Roles', e);
    }
  }

  async kicking(
    toKick: any,
    concernedchannel: string,
    amItheOwner,
    amIAnAdmin,
  ): Promise<boolean> {
    // console.log('kicking ', toKick);
    const completeObjects = toKick.map(async (element: any) => {
      const user = await this.prismaServ.user.findUnique({
        where: { login: element.login },
        include: {
          ownedChannels: true,
          adminChannels: true,
          channels: true,
        },
      });
      // console.log('le user ', user);
      if (user) {
        return {
          us: user,
          activate: true,
        };
      }
      return null; // or you can return some default value or error indicator
    });
    const allObject = (await Promise.all(completeObjects)).filter(Boolean); // We
    allObject.forEach((obj) => {
      if (amItheOwner) {
        if (obj.us.adminChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = true;
        }
        if (obj.us.ownedChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
      } else if (amIAnAdmin) {
        if (obj.us.adminChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
        if (obj.us.ownedChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
      }
    });
    const isStgFalse = allObject.some((e) => e.activate === false);
    if (!isStgFalse) return true;
    else return false;
  }

  async getNewRequestBody(
    bannedOrMuted: any,
    concernedchannel: string,
    amItheOwner,
    amIAnAdmin,
  ): Promise<Array<{ login: string; ExpiryTime: string }>> {
    const completeObjects = bannedOrMuted.map(async (element: any) => {
      const user = await this.prismaServ.user.findUnique({
        where: { login: element.login },
        include: {
          ownedChannels: true,
          adminChannels: true,
          channels: true,
        },
      });
      // console.log('le user ', user);
      if (user) {
        return {
          us: user,
          ExpiryTime: element.ExpiryTime,
          activate: true,
        };
      }
      return null; // or you can return some default value or error indicator
    });
    let allObject = (await Promise.all(completeObjects)).filter(Boolean); // We filter out any null values from the results
    // console.log(allObject);
    allObject.forEach((obj) => {
      if (amItheOwner) {
        if (obj.us.adminChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = true;
        }
        if (obj.us.ownedChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
      } else if (amIAnAdmin) {
        if (obj.us.adminChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
        if (obj.us.ownedChannels.some((e) => e.name === concernedchannel)) {
          obj.activate = false;
        }
      }
    });
    allObject = allObject.filter((e) => e.activate !== false);
    const lastArray = new Array<{ login: string; ExpiryTime: string }>();
    allObject.forEach((e) => {
      lastArray.push({ login: e.us.login, ExpiryTime: e.ExpiryTime });
    });
    return lastArray;
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
