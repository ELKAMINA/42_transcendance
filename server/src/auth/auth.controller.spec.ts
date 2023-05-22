import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const userID = "123";
const testUser1 = 'Test user 1';
const testPwd1 = 'Test pwd 1';
const access_token = "acc_test";
const refresh_token = "ref_test";

describe('Authentication Controller ', () => {
    let authcontroller: AuthController;
    let authservice: AuthService;


    beforeEach(async () => {
 
    /*Test provides an application execution context which mock the full nest run time. The createTestingModule return a TestingModule instance  */
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signup: jest.fn().mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
                        signin: jest.fn().mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
                        logout: jest.fn().mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
                        refresh: jest.fn().mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
                        findUser: jest.fn().mockResolvedValue({
                            access_token,
                            refresh_token,
                        }),
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
            const dto = {nickname: testUser1, password: testPwd1, avatar: ""}
            await expect(authcontroller.signin(dto)).resolves.toEqual({
                access_token,
                refresh_token,
            })
        })
    })

    // it('SignUp2FAs: it should sign up a user that chose 2FA', () => {
    //     const dto = {userId:"id2", nickname: "nick2"};
    //     expect(mockAuthService.signTokens(dto.userId, dto.nickname));
    // })

    // it('UpdateRtHash: it should update the user`s refresh token', () => {
    //     const dto = {userId:"id3", rt: "refresh"};
    //     expect(mockAuthService.updateRt(dto.userId, dto.rt));
    // })

    // it('SignUp: it should sign up the user', () => {
    //     const dto = {nickname:"nick2", password: "pwd1", avatar:"av1"};
    //     expect(mockAuthService.signup(dto));
    // })
    // it('SignIn: it should sign in the user', () => {
    //     const dto = {nickname:"nick3", password: "pwd1", avatar:"av1"};
    //     expect(mockAuthService.signin(dto));
    // })
    // it('logout: it should logout the user', () => {
    //     const dto = {nickname:"nick4", sub: "sub1"};
    //     expect(mockAuthService.logout(dto));
    // })
})

