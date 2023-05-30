import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
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
const at_secret = "new_acc_test";
const rt_secret = "new_ref_test";
const log = "loginTest";
const url = "url";
const qrCode = "qrcode"

const user = {login: log, user_id: userID}

jest.mock('../prisma/prisma.service.ts');
jest.mock('@nestjs/config');
jest.mock('../user/user.service.ts');
jest.mock('@nestjs/jwt');

describe('Authentication Service ', () => {
    let authservice: AuthService;
    let configserv: ConfigService;
    let jwtserv: JwtService;
    let userserv: UserService;
    let prismaserv: PrismaService;
    // let prismaservice: PrismaService;
    // let jwtservice: JwtService;
	//  Each of our tests needs to be independent, and we need to ensure that. without beforeEach, If we add more tests, all of them will use the same instance of the  independencies. It breaks the rule of all tests being independent.
    beforeEach(async () => {
        configserv = new ConfigService();
        prismaserv = new PrismaService(configserv);
        userserv = new UserService(prismaserv);
        // jwtserv = new JwtService();
        authservice = new AuthService(prismaserv, configserv, jwtserv, userserv);
    /*Test provides an application execution context which mock the full nest run time. The createTestingModule return a TestingModule instance  */
    })
    it('should be defined', () => {
        expect(authservice).toBeDefined();
    })
    describe('SignTokens: it should create generate tokens', () => {
        it ('should return an object of access and refresh tokens', async() => {
            await expect(typeof(authservice.signTokens(userID, log))).toBe('object')
            console.log(await authservice.signTokens(userID, log))

            await expect(authservice.signTokens(userID, log)).resolves.toEqual({
                access_token: 'mockedValue',
                refresh_token: 'mockedValue',
            })
        })
    })
    // describe('updateRtHash: it should update user refresh token', () => {
    //     it ('it should update the user`s token aften access token expired', async() => {
    //         const initialData = { user_id: userID, rtHash: "initial"};
            
    //         await expect(authservice.updateRtHash(userID, r_token)).resolves.toEqual({
    //         })
    //     })
    // })
    // describe('SignIn: it should sign in a user', () => {
    //     it ('should return an object of tokens', async() => {
    //         const dto = {nickname: testUser1, password: testPwd1, avatar: ""}
    //        await expect(authservice.signin(dto)).resolves.toEqual({
    //             a_token,
    //             r_token,
    //         })
    //     })
    // })
    // describe('Logout: it should logout a user', () => {
    //     it ('should delete user`s refresh tokens', async() => {
	// 		const payload = {nickname: testUser1, sub: userID}
    //         await expect(authservice.logout(payload)).resolves.toEqual({
	// 			rt:null, ...payload,
    //         })
    //     })
    // })
	// describe('Refresh_Tokens: it should refresh a user', () => {
    //     it ('should refresh existing tokens', async() => {
	// 		const payload = {nickname: testUser1, sub: userID}
    //        await expect(authservice.refresh(payload, r_token)).resolves.toEqual({access_token: new_at, refresh_token: new_rt})
    //     })
    // })

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

