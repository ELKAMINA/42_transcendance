import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {
	// async canActivate(context: ExecutionContext) {
	// 	const request = context.switchToHttp().getRequest();
	// 	console.log('La requeete ', request);
	// 	const activate = (await super.canActivate(context)) as boolean;
	// 	console.log('Activate ', activate);
	// 	return activate;
	//   }
}
