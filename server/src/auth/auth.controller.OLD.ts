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

describe('Authentication Controller ', () => {
    let authcontroller: AuthController;
    let authservice: AuthService;

    // const mockAuthService = {
    //     signTokens: jest.fn((x, y) => {
    //         return {
    //             access_token: expect.any(String),
    //             refresh_token: expect.any(String),
    //         }
    //     }),
    //     signTokens2FA: jest.fn((x, y) => {
    //         return {
    //             access_token: expect.any(String),
    //             refresh_token: expect.any(String),
    //         }
    //     }),
    //     updateRt: jest.fn((id, rt) => {
    //         rt;
    //     }),
    //     signup: jest.fn((dto)=> {
    //         return {
    //             faEnabled: expect.any(Boolean),
    //             tokens: {
    //                 access_tokens: expect.any(String),
    //                 refresh_tokens: expect.any(String),
    //             }
    //         }
    //     }),
    //     signin: jest.fn((dto)=> {
    //         return {
    //             faEnabled: expect.any(Boolean),
    //             tokens: {
    //                 access_tokens: expect.any(String),
    //                 refresh_tokens: expect.any(String),
    //             }
    //         }
    //     }),
    //     logout: jest.fn((payload)=> {
    //         rt: expect.any(null);
    //     }),
    //     refresh: jest.fn((payload, rt)=> {
            
    //     }),
    // }
    // const mockUserService = {

    // }
    // const mockPrismaService = {

    // }

    // const mockConfigService = {

    // }

    // const mockJwtService = {

    // }
    beforeEach(async () => {
 
    /*Test provides an application execution context which mock the full nest run time. The createTestingModule return a TestingModule instance  */
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, UserService, PrismaService, ConfigService, JwtService],
        })
        .overrideProvider([AuthService, UserService, PrismaService, ConfigService, JwtService])
        .useValue([mockAuthService, mockUserService, mockPrismaService, mockConfigService, JwtService])
        .compile();
        authcontroller = module.get<AuthController>(AuthController);
        /* This method bootstraps a module with its dependencies and returns a module that is ready for testing*/
        /* After compiling, the module is ready to use. Once the module is compiled you can retrieve any static instance it declares (controllers and providers) using the get() method */

        // authservice = moduleRef.get<AuthService>(AuthService);
        // authcontroller = moduleRef.get<AuthController>(AuthController);
        // authservice = await moduleRef.resolve(AuthService); // returns unique instance of the provider

    })
    it('should be defined', () => {
        expect(authcontroller).toBeDefined();
    })

    it('SignUp: it should sign up a user', () => {
        const dto = {userId:"id1", nickname: "nick1"};
        expect(mockAuthService.signTokens(dto.userId, dto.nickname));
    })

    it('SignUp2FAs: it should sign up a user that chose 2FA', () => {
        const dto = {userId:"id2", nickname: "nick2"};
        expect(mockAuthService.signTokens(dto.userId, dto.nickname));
    })

    it('UpdateRtHash: it should update the user`s refresh token', () => {
        const dto = {userId:"id3", rt: "refresh"};
        expect(mockAuthService.updateRt(dto.userId, dto.rt));
    })

    it('SignUp: it should sign up the user', () => {
        const dto = {nickname:"nick2", password: "pwd1", avatar:"av1"};
        expect(mockAuthService.signup(dto));
    })
    it('SignIn: it should sign in the user', () => {
        const dto = {nickname:"nick3", password: "pwd1", avatar:"av1"};
        expect(mockAuthService.signin(dto));
    })
    it('logout: it should logout the user', () => {
        const dto = {nickname:"nick4", sub: "sub1"};
        expect(mockAuthService.logout(dto));
    })
})

