// import * as argon from 'argon2';
// import * as qrcode from 'qrcode';
// import * as otplib from 'otplib';
// import { JwtService } from '@nestjs/jwt';
// import { Test, TestingModule } from '@nestjs/testing';

// import {
//   user,
//   url,
//   pwd,
//   DtoTest,
//   tokens,
//   asyncTokens,
//   tfaPayload,
//   OauthUserInfo,
//   signing,
//   userInfo,
//   rTok,
//   userRegistered,
//   tfaCode,
//   secret,
// } from '../stubs/stubs.stub';
// import { AuthService } from 'src/auth/auth.service';
// import { UserService } from '../../../user/user.service';
// import { ConfigService } from '@nestjs/config';
// import { PrismaService } from '../../../prisma/prisma.service';

// /* Objectif : Tester que les controllers appellent les fonctions du service avec les bons arguments */
// jest.mock('argon2');
// jest.mock('otplib');
// jest.mock('qrcode');
// jest.mock('../../../prisma/prisma.service.ts');
// jest.mock('../../../user/user.service.ts');

// describe('Authentication Service ', () => {
//   let authservice: AuthService;
//   let prismaservice: PrismaService;
//   let userservice: UserService;
//   let configservice: ConfigService;
//   let jwtservice: JwtService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [],
//       controllers: [],
//       providers: [
//         PrismaService,
//         UserService,
//         AuthService,
//         {
//           provide: JwtService,
//           useValue: {
//             // Mock the methods you want to use in your tests
//             signAsync: jest.fn().mockReturnValue('test'),
//           },
//         },
//         {
//           provide: ConfigService,
//           useValue: {
//             // Mock the methods you want to use in your tests
//             get: jest.fn().mockReturnValue('test'),
//           },
//         },
//       ],
//     }).compile();

//     authservice = module.get<AuthService>(AuthService);
//     prismaservice = module.get<PrismaService>(PrismaService);
//     userservice = module.get<UserService>(UserService);
//     jwtservice = module.get<JwtService>(JwtService);
//     configservice = module.get<ConfigService>(ConfigService);

//     jest.clearAllMocks();
//   });
//   /* ******************************************* */

//   describe('SignTokens: it should create signed access and refresh tokens', () => {
//     describe('when function signTokens is called', () => {
//       let toke;

//       beforeEach(async () => {
//         toke = await authservice.signTokens(OauthUserInfo().id, user().login);
//       });

//       test('then it should call jwt signAsync function ', () => {
//         expect(jwtservice.signAsync).toHaveBeenCalled();
//       });

//       test('then it should return an object of tokens', () => {
//         expect(toke).toEqual(asyncTokens);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('SignTokens2FA: it should create signed access and refresh tokens for 2FA ', () => {
//     describe('when function signTokens is called', () => {
//       let toke;

//       beforeEach(async () => {
//         toke = await authservice.signTokens2FA(tfaPayload);
//       });

//       test('then it should call jwt signAsync function ', () => {
//         expect(jwtservice.signAsync).toHaveBeenCalled();
//         console.log(configservice.get);
//       });

//       test('then it should return an object of tokens', () => {
//         expect(toke).toEqual(asyncTokens);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('updateRtHash: it should update user`s refresh token', () => {
//     describe('when function updateRtHash is called', () => {
//       beforeEach(async () => {
//         await authservice.updateRtHash(OauthUserInfo().id, tokens.rToken);
//       });

//       test('then it should call argon library for hashing the refresh token ', () => {
//         expect(argon.hash as jest.Mock).toHaveBeenCalledWith(tokens.rToken);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('signup: it should signup a user', () => {
//     describe('when function signup is called', () => {
//       let result;

//       test('Success - then it should call argon library for hashing the password then create a user and finally return an object of tokens and the boolean faEnablef', async () => {
//         result = await authservice.signup(new DtoTest());
//         expect(argon.hash as jest.Mock).toHaveBeenCalledWith(pwd);
//         expect(prismaservice.user.create).toHaveBeenCalled();
//         expect(result).toEqual(signing);
//       });

//       test('Failure - then throw an error bco credentials already taken', async () => {
//         await expect(authservice.signup(new DtoTest())).rejects.toThrowError(
//           'Credentials taken',
//         );
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('signin: it should signin a user', () => {
//     describe('when function signin is called', () => {
//       let result;

//       test('Success - then it should call argon library for hashing the password then create a user and finally return an object of tokens and the boolean faEnablef', async () => {
//         result = await authservice.signin(new DtoTest());
//         expect(prismaservice.user.findUniqueOrThrow).toHaveBeenCalled();
//         expect(argon.verify as jest.Mock).toHaveBeenCalled();
//         expect(result).toEqual(signing);
//       });

//       test('Failure - then throw an error bco credentials already taken', async () => {
//         await expect(authservice.signin(new DtoTest())).rejects.toThrowError(
//           'No user found',
//         );
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('logout: it should logout a user ', () => {
//     describe('when function logout is called', () => {
//       test('Success - then it should delete the user`s rthash and log it out', async () => {
//         await authservice.logout(userInfo());
//         expect(prismaservice.user.updateMany).toHaveBeenCalled();
//       });

//       test('Failure - then it shouldn`t delete the user`s rthash and log it out', async () => {
//         await expect(authservice.logout(userInfo())).rejects.toThrowError('ko');
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('refresh: it should refresh a user', () => {
//     describe('when function refresh is called', () => {
//       let result;

//       test('Success - then it should call findUnique function from prisma', async () => {
//         result = await authservice.refresh(userInfo(), rTok);
//         expect(prismaservice.user.findUnique).toHaveBeenCalled();
//         expect(argon.verify as jest.Mock).toHaveBeenCalled();
//         expect(result).toEqual(signing.tokens);
//       });

//       test('Failure - then throw an error bco user not found or doesnt have any refresh token', async () => {
//         await expect(
//           authservice.refresh(userInfo(), rTok),
//         ).rejects.toThrowError('Access Denied');
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('validateUser : it should find or create a user when 42 Oauthentication', () => {
//     describe('when function validateUser is called', () => {
//       let result;

//       test('Case 1 - then it should call findUnique function from prisma and find a user if already connected with 42 Oauthentication', async () => {
//         result = await authservice.validateUser(OauthUserInfo());
//         expect(prismaservice.user.findUnique).toHaveBeenCalled();
//         expect(result).toEqual(userRegistered());
//       });

//       test('Case 2 - or it should call findUnique function from prisma and NOT find a user ', async () => {
//         await expect(
//           authservice.refresh(userInfo(), rTok),
//         ).rejects.toThrowError('Record not found');
//       });

//       test('Case 3 - or it should call create function from prisma to create a new user that authenticated with 42 Oauthentication', async () => {
//         result = await authservice.validateUser(OauthUserInfo());
//         expect(prismaservice.user.create).toHaveBeenCalled();
//         expect(result).toEqual(userRegistered());
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('findUser : it should search a user, if found, update its refresh token', () => {
//     describe('when function findUser is called', () => {
//       let result;

//       test('Case 1 - then it should call searchUser function from userServ and find a user ', async () => {
//         result = await authservice.findUser(OauthUserInfo());
//         // console.log(result);
//         expect(userservice.searchUser).toHaveBeenCalledWith(
//           OauthUserInfo().login,
//         );
//         expect(result).toEqual({
//           user: user().login,
//           accessToken: asyncTokens.access_token,
//           refreshToken: asyncTokens.refresh_token,
//         });
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('turnOnTwoFactorAuthentication : it should turn on 2FA authentication for a user', () => {
//     describe('when function turnOnTwoFactorAuthentication is called', () => {
//       test('Success - it should call update function from prisma and update its faenabled attribute ', async () => {
//         await authservice.turnOnTwoFactorAuthentication(OauthUserInfo().id);
//         expect(prismaservice.user.update).toHaveBeenCalled();
//       });

//       test('Failure - it should call update function from prisma and throw error bc user not found ', async () => {
//         await expect(
//           authservice.turnOnTwoFactorAuthentication(OauthUserInfo().id),
//         ).rejects.toThrowError('Record not found');
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('generateQrCodeDataURL : it should generate Qr code', () => {
//     describe('when function generateQrCodeDataURL is called', () => {
//       test('Success - it should generate qr code for the 2fa authentication', async () => {
//         await authservice.generateQrCodeDataURL(url);
//         expect(qrcode.toDataURL).toHaveBeenCalled();
//       });
//     });
//   });

//   /* *******************************************  ATTENTION A REVOIR CAR NE PASSE PAS AUX TESTS*/

//   // describe('generateTwoFactorAuthenticationSecret : it should vgenerate the 2fa secret', () => {
//   //   describe('when function generateTwoFactorAuthenticationSecret is called', () => {
//   //     let result;

//   //     test('Success - it should validate the code sent by the user and allow 2fa authentication', async () => {
//   //       result = await authservice.generateTwoFactorAuthenticationSecret(
//   //         userInfo(),
//   //       );
//   //       console.log(result);
//   //       expect(
//   //         otplib.authenticator.generateSecret as jest.Mock,
//   //       ).toHaveBeenCalled();
//   //       expect(otplib.authenticator.keyuri as jest.Mock).toHaveBeenCalledWith(
//   //         userInfo().nickname,
//   //         configservice.get('2FA_APP_NAME'),
//   //         secret,
//   //       );
//   //       expect(result).toEqual(qrCode);
//   //     });
//   //   });
//   // });

//   /* ******************************************* */

//   describe('isTwoFactorAuthenticationCodeValid : it should verify if the code sent by the user for the 2fa authentication is valid', () => {
//     describe('when function isTwoFactorAuthenticationCodeValid is called', () => {
//       test('Success - it should validate the code sent by the user and allow 2fa authentication', async () => {
//         await authservice.isTwoFactorAuthenticationCodeValid(
//           tfaCode,
//           userInfo(),
//         );
//         expect(userservice.searchUser).toHaveBeenCalledWith(
//           userInfo().nickname,
//         );
//         expect(otplib.authenticator.verify as jest.Mock).toHaveBeenCalled();
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('setTwoFactorAuthenticationSecret : it should set the secret Key for a user using the 2fa authentication', () => {
//     describe('when function setTwoFactorAuthenticationSecret is called', () => {
//       test('Success - it should call update prisma function ', async () => {
//         await authservice.setTwoFactorAuthenticationSecret(secret, {
//           login: OauthUserInfo().login,
//           id: OauthUserInfo().id,
//         });
//         expect(prismaservice.user.update).toHaveBeenCalled();
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('loginWith2fa : it should search and find a user and ', () => {
//     describe('when function loginWith2fa is called', () => {
//       let result;

//       test('Success - it should call gnerateSecret then the keyuri then setting the secret and finally generate the QrCode', async () => {
//         result = await authservice.loginWith2fa(userInfo());
//         expect(userservice.searchUser).toHaveBeenCalled();
//         expect(result).toEqual({
//           login: user().login,
//           access_token: asyncTokens.access_token,
//           refresh_token: asyncTokens.refresh_token,
//         });
//       });
//     });
//   });
// });
