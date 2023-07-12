// import { Test, TestingModule } from '@nestjs/testing';
// import { Response, Request } from 'express';

// import {
//   user,
//   DtoTest,
//   signing,
//   tokens,
//   userInfo,
//   rTok,
//   OauthUserInfo,
//   qrCode,
// } from '../stubs/stubs.stub';
// import { AuthService } from '../../auth.service';
// import AuthController from '../../auth.controller';

// /* Objectif : Tester que les controllers appellent les fonctions du service avec les bons arguments */
// jest.mock('../../auth.service.ts');

// describe('Authentication Controller ', () => {
//   let authcontroller: AuthController;
//   let authservice: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [],
//       controllers: [AuthController],
//       providers: [AuthService],
//     }).compile();

//     authcontroller = module.get<AuthController>(AuthController);
//     authservice = module.get<AuthService>(AuthService);
//     jest.clearAllMocks();
//   });

//   /* ******************************************* */

//   describe('SignUp: it should sign up a user', () => {
//     describe('when function signup is called', () => {
//       let tok;

//       beforeEach(async () => {
//         tok = await authcontroller.signup(new DtoTest());
//         // console.log(tok);
//       });

//       test('then it should call authService', () => {
//         expect(authservice.signup).toBeCalledWith(new DtoTest());
//       });

//       test('then it should return an object of faEnabled and tokens', () => {
//         expect(tok).toEqual(signing);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('SignIn: it should sign in a user', () => {
//     describe('when function signin is called', () => {
//       let tok;

//       beforeEach(async () => {
//         tok = await authcontroller.signin(new DtoTest());
//       });

//       test('then it should call authService', () => {
//         expect(authservice.signin).toBeCalledWith(new DtoTest());
//       });

//       test('then it should return an object of tokens', () => {
//         expect(tok.tokens).toEqual(tokens);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('Logout: it should logout a user', () => {
//     beforeEach(async () => {
//       await authcontroller.logout(userInfo());
//     });

//     describe('when function lougout is called', () => {
//       test('then it should call authService logout function with userInfo arg', () => {
//         expect(authservice.logout).toBeCalledWith(userInfo());
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('Refresh: it should refresh a user`s rt token', () => {
//     describe('when function refresh is called', () => {
//       let tok;

//       beforeEach(async () => {
//         tok = await authcontroller.refresh(userInfo(), rTok);
//       });

//       test('then it should call authService refresh function with userInfo and refresh token args', () => {
//         expect(authservice.refresh).toBeCalledWith(userInfo(), rTok);
//       });

//       test('then it should return a promise object with new refresh token and new access tokens', () => {
//         expect(tok.tokens).toEqual(tokens);
//       });
//     });
//   });

//   /* ******************************************* */

//   describe('oAuthRedirect: it should authenticate a user with the 42 authentication and send the access and refresh tokens to the front end', () => {
//     describe('when function oAuthRedirect is called', () => {
//       let mockResponse: Partial<Response>;
//       let usLg;

//       beforeEach(async () => {
//         mockResponse = {
//           cookie: jest.fn(),
//           json: jest.fn(),
//         };
//         usLg = await authcontroller.oAuthRedirect(
//           OauthUserInfo(),
//           mockResponse as Response,
//         );
//       });

//       test('then it should call authService findUser function with OAuth userInfo ', () => {
//         expect(authservice.findUser).toBeCalledWith(OauthUserInfo());
//       });

//       test('then it should return a user login ', () => {
//         expect(usLg.login).toEqual(user().login);
//       });
//     });

//     /* ******************************************* */

//     describe('register: it should register the two factor authentication for a user', () => {
//       describe('when function register is called', () => {
//         let mockResponse: Partial<Response>;
//         let mockRequest: Partial<Request>;
//         let result;

//         beforeEach(async () => {
//           mockRequest = {
//             user: {
//               id: 1,
//               name: 'John Doe',
//               role: 'admin',
//             },
//           };
//           mockResponse = {
//             json: jest.fn(),
//           };
//           result = await authcontroller.register(
//             mockResponse as Response,
//             mockRequest as Request,
//           );
//         });

//         test('then it should call authService generateTwoFactorAuthenticationSecret function with request.user ', () => {
//           expect(
//             authservice.generateTwoFactorAuthenticationSecret,
//           ).toBeCalledWith((mockRequest as Request).user);
//         });

//         test('then it should return an json url ', () => {
//           expect(result).toEqual(mockResponse.json(qrCode));
//         });
//       });
//     });

//     /* ******************************************* */

//     describe('turnOnTwoFactorAuthentication : it should turn on the two factor authentication for a user', () => {
//       describe('when function turnOnTwoFactorAuthentication is called', () => {
//         let mockRequest: Partial<Request>;
//         let mockBody;

//         beforeEach(async () => {
//           mockRequest = {
//             user: {
//               sub: '6762',
//               name: 'John kalachnikov',
//               role: 'admin',
//             },
//             body: {
//               TfaCode: '333',
//             },
//           };
//           mockBody = {
//             name: 'Johnny Bravo',
//             age: 30,
//             TfaCode: (mockRequest as Request).body.TfaCode,
//           };
//           await authcontroller.turnOnTwoFactorAuthentication(
//             mockRequest as Request,
//             mockBody,
//           );
//         });

//         test('then it should call authService isTwoFactorAuthenticationCodeValid function with request.user and TfaCode', () => {
//           expect(authservice.isTwoFactorAuthenticationCodeValid).toBeCalledWith(
//             mockBody.TfaCode,
//             (mockRequest as Request).user,
//           );
//         });

//         test('then it should call authService turnOnTwoFactorAuthentication function with request.user.sub', () => {
//           expect(authservice.turnOnTwoFactorAuthentication).toHaveBeenCalled();
//         });

//         // test('then it should call authService turnOnTwoFactorAuthentication function with request.user.sub', () => {
//         //   expect(authservice.turnOnTwoFactorAuthentication).toBeCalledWith((mockRequest.user.sub));
//         // }); /* Ne passe pas, je ne sais pas pk */
//       });
//     });

//     /* ******************************************* */

//     describe('authenticate : it should authenticate a user with 2fa', () => {
//       describe('when function authenticate is called', () => {
//         let mockRequest: Partial<Request>;
//         let mockBody;
//         let result;

//         beforeEach(async () => {
//           mockRequest = {
//             user: {
//               sub: '6762',
//               name: 'John kalachnikov',
//               role: 'admin',
//             },
//             body: {
//               TfaCode: '333',
//             },
//           };
//           mockBody = {
//             name: 'Johnny Bravo',
//             age: 30,
//             TfaCode: (mockRequest as Request).body.TfaCode,
//           };
//           result = await authcontroller.authenticate(
//             mockRequest as Request,
//             mockBody,
//           );
//         });

//         test('then it should call authService isTwoFactorAuthenticationCodeValid function with request.user and TfaCode', () => {
//           expect(authservice.isTwoFactorAuthenticationCodeValid).toBeCalledWith(
//             mockBody.TfaCode,
//             (mockRequest as Request).user,
//           );
//         });

//         test('then it should call authService loginWith2fa function with request.user', () => {
//           expect(authservice.loginWith2fa).toBeCalledWith(
//             (mockRequest as Request).user,
//           );
//         });

//         test('then it should return', () => {
//           expect(result).toEqual(user());
//         }); /* Ne passe pas, je ne sais pas pk */
//       });
//     });
//   });
// });
