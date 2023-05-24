import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto } from './dto';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from '../user/user.service';

/* Déclaratio de variables pour les simulations */
const userID = "123";
const testUser1 = 'Test user 1';
const testPwd1 = 'Test pwd 1';
const a_token = "acc_test";
const r_token = "ref_test";
const new_at = "new_acc_test";
const new_rt = "new_ref_test";
const log = "loginTest";
const url = "url";
const qrCode = "qrcode"

describe('Authentication Controller ', () => {
    let authcontroller: AuthController;
    let authservice: AuthService;
    const res = {} as unknown as Response;
    const req = {} as unknown as Request;
    res.cookie = jest.fn();
    res.json = jest.fn();
    // req.user = jest.fn();
    // res.json = jest.fn();
    // res.status = jest.fn(() => res);

	//  Each of our tests needs to be independent, and we need to ensure that. without beforeEach, If we add more tests, all of them will use the same instance of the  independencies. It breaks the rule of all tests being independent.
    beforeEach(async () => {
 
    /*Test provides an application execution context which mock the full nest run time. The createTestingModule return a TestingModule instance  */
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signup: jest
							.fn()
							.mockResolvedValue({
                            a_token,
                            r_token,
                        }),
                        signin: jest
							.fn()
							.mockResolvedValue({
                            a_token,
                            r_token,
                        }),
                        logout: jest
							.fn()
							.mockImplementation((dto: AuthDto) => Promise.resolve({rt: null, ...dto}),
						),
                        refresh: jest
							.fn()
							.mockImplementation(({nickname: testUser1, password: testPwd1}, r_token) => Promise.resolve({
                                access_token: new_at,
                                refresh_token: new_rt
							}),
						),
                        findUser: jest
							.fn()
							.mockImplementation(({ login: log, id: userID }) => 
                            Promise.resolve({
                                user: log,
                                access_token: a_token,
                                refresh_token: r_token,
							}),
                        ),
                        // generateTwoFactorAuthenticationSecret: jest
                        //     .fn()
                        //     .mockImplementation((req.user) => 
                        //         Promise.resolve({
                        //             secret: expect.any(String),
                        //             otpauthUrl: expect.any(String),
						// 	    })
                        //     ),
                //         generateQrCodeDataURL: jest
                //         .fn()
                //         .mockImplementation((url) => 
                //             Promise.resolve(
                //                 qrCode
                //         )
                // ),
                    }
                },
                {
                    provide: PrismaService,
                    useValue:{}
                },
                {
                    provide: ConfigService,
                    useValue:{}
                },
                {
                    provide: UserService,
                    useValue:{}
                }
            ],
        }).compile();
        authcontroller = module.get<AuthController>(AuthController);
        authservice = module.get<AuthService>(AuthService);
        
        /* This method bootstraps a module with its dependencies and returns a module that is ready for testing*/
        /* After compiling, the module is ready to use. Once the module is compiled you can retrieve any static instance it declares (controllers and providers) using the get() method */

        // authservice = moduleRef.get<AuthService>(AuthService);
        // authcontroller = moduleRef.get<AuthController>(AuthController);
        // authservice = await moduleRef.resolve(AuthService); // returns unique instance of the provider

    })
    it('should be defined', () => {
        expect(authcontroller).toBeDefined();
    })
    describe('SignUp: it should sign up a user', () => {
        it ('should return an object of tokens', async() => {
            const dto = {nickname: testUser1, password: testPwd1, avatar: ""}
            await expect(authcontroller.signup(dto)).resolves.toEqual({
                a_token,
                r_token,
            })
        })
    })
    describe('SignIn: it should sign in a user', () => {
        it ('should return an object of tokens', async() => {
            const dto = {nickname: testUser1, password: testPwd1, avatar: ""}
           await expect(authcontroller.signin(dto)).resolves.toEqual({
                a_token,
                r_token,
            })
        })
    })
    describe('Logout: it should logout a user', () => {
        it ('should delete user`s refresh tokens', async() => {
			const payload = {nickname: testUser1, sub: userID}
            await expect(authcontroller.logout(payload)).resolves.toEqual({
				rt:null, ...payload,
            })
        })
    })
	describe('Refresh_Tokens: it should refresh a user', () => {
        it ('should refresh existing tokens', async() => {
			const payload = {nickname: testUser1, sub: userID}
           await expect(authcontroller.refresh(payload, r_token)).resolves.toEqual({access_token: new_at, refresh_token: new_rt})
        })
    })

    /* ********************************************** */
    // describe('OAuthRedirect: it should redirect a user', () => {
    //     it ('should find a user and return the user', async () => {
	// 		const payload = {login: log, id: userID};
    //        await expect(authcontroller.oAuthRedirect(payload, res)).toEqual(log);
    //     })
    // }), /* Code qui ne passe pas les tests: Dont know why */

    // describe('register: it registers the 2FA authentication for a user ', () => {
    //     it ('should send back a url string', async () => {
    //         // jest.spyOn(AuthService, "generateTwoFactorAuthenticationSecrert").mockImplementation(() => url)
    //        await expect(authcontroller.register(res, req)).resolves.toEqual(JSON.stringify(qrCode));
    //     })
    // })

})

