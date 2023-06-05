import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthDto } from '../../dto/auth.dto';
import { AuthService } from '../../auth.service';
import AuthController from '../../auth.controller';
import { UserService } from '../../../user/user.service';
import { PrismaService } from '../../../prisma/prisma.service';

/* Objectif : Tester que les controllers appellent les fonctions du service avec les bons arguments */

/* Déclaratio de variables pour les simulations */
const userID = '123';
const testUser1 = 'Test user 1';
const testPwd1 = 'Test pwd 1';
const aToken = 'acc_test';
const rToken = 'ref_test';
const newAt = 'new_acc_test';
const newRt = 'new_ref_test';

describe('Authentication Controller ', () => {
  let authcontroller: AuthController;
  const res = {} as unknown as Response;
  res.cookie = jest.fn();
  res.json = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockResolvedValue({
              aToken,
              rToken,
            }),
            signin: jest.fn().mockResolvedValue({
              aToken,
              rToken,
            }),
            logout: jest
              .fn()
              .mockImplementation((dto: AuthDto) =>
                Promise.resolve({ rt: null, ...dto }),
              ),
            refresh: jest.fn().mockResolvedValue({
              access_token: newAt,
              refresh_token: newRt,
            }),
            findUser: jest.fn().mockResolvedValue({
              access_token: aToken,
              refresh_token: rToken,
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();
    authcontroller = module.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(authcontroller).toBeDefined();
  });
  describe('SignUp: it should sign up a user', () => {
    it('should return an object of tokens', async () => {
      const dto = { nickname: testUser1, password: testPwd1, avatar: '' };
      await expect(authcontroller.signup(dto)).resolves.toEqual({
        aToken,
        rToken,
      });
    });
  });
  describe('SignIn: it should sign in a user', () => {
    it('should return an object of tokens', async () => {
      const dto = { nickname: testUser1, password: testPwd1, avatar: '' };
      await expect(authcontroller.signin(dto)).resolves.toEqual({
        aToken,
        rToken,
      });
    });
  });
  describe('Logout: it should logout a user', () => {
    it('should delete user`s refresh tokens', async () => {
      const payload = { nickname: testUser1, sub: userID };
      await expect(authcontroller.logout(payload)).resolves.toEqual({
        rt: null,
        ...payload,
      });
    });
  });
  describe('Refresh_Tokens: it should refresh a user', () => {
    it('should refresh existing tokens', async () => {
      const payload = { nickname: testUser1, sub: userID };
      await expect(authcontroller.refresh(payload, rToken)).resolves.toEqual({
        access_token: newAt,
        refresh_token: newRt,
      });
    });
  });
});
