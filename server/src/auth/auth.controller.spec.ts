import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto } from './dto';
import { prismaMock } from '../../singleton';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from '../user/user.service';
import { AuthDTOStub, JwtPayloadStub}from './tests/index';

const userID = "123";
const testUser1 = 'Test user 1';
const testPwd1 = 'Test pwd 1';
const access_token = "acc_test";
const refresh_token = "ref_test";

describe('Authentication Controller ', () => {
    let authcontroller: AuthController;
    let authservice: AuthService;

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
                            access_token,
                            refresh_token,
                        }),
                        signin: jest
							.fn()
							.mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
                        logout: jest
							.fn()
							.mockImplementation((dto: AuthDto) => Promise.resolve({rt: null, ...dto}),
						),
                        refresh: jest
							.fn()
							.mockImplementation(({nickname: testUser1, password: testPwd1}, refresh_token) => Promise.resolve({

							}),
						),
                        // findUser: jest
						// 	.fn()
						// 	.mockResolvedValue({
                        //     access_token,
                        //     refresh_token,
                        // }),
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
                access_token,
                refresh_token,
            })
        })
    })
    describe('SignIn: it should sign in a user', () => {
        it ('should return an object of tokens', async() => {
            const dto = {nickname: testUser1, password: testPwd1, avatar: ""}
            await expect(authcontroller.signin(dto)).resolves.toEqual({
                access_token,
                refresh_token,
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
            await expect(authcontroller.refresh(payload, refresh_token)).toBeCalled();
        })
    })

})

