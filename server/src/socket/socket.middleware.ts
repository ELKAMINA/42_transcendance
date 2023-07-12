// import { JwtService } from '@nestjs/jwt';
// import { Socket } from 'socket.io';
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { ExtendedError } from 'socket.io/dist/namespace';
// import { parse } from 'cookie';
// import { ConfigService } from '@nestjs/config';


// @Injectable()
// export class MyMiddleware implements NestMiddleware {
//   constructor(private jwt: JwtService, private config: ConfigService) {}

//   async use(socket: Socket, next: (err?: ExtendedError) => void) {
//     try {
//     //   console.log('la socket from middleware ', socket);
//       const { Authcookie: userInfo } = parse(socket.handshake.headers.cookie);
//       const user = JSON.parse(userInfo);
//       console.log("AT ", typeof user.accessToken);
//       console.log('SECRET ', this.config.get('ACCESS_TOKEN'));
//       const verification = await this.jwt.verifyAsync(user.accessToken, {
//         secret: this.config.get('ACCESS_TOKEN'),
//       });
//     //   console.log('verification ', verification);
//       next(); // Call the next function to allow the socket connection to proceed
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }
