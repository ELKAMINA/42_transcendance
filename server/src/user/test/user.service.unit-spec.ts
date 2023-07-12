// import { Test, TestingModule } from '@nestjs/testing';

// import { Allusers } from './stubs/index';
// import { UserService } from '../user.service';
// import { PrismaService } from '../../prisma/prisma.service';

// jest.mock('../../prisma/prisma.service.ts');

// describe('UserService', () => {
//   let userservice: UserService;
//   let prismaservice: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [],
//       controllers: [],
//       providers: [PrismaService, UserService],
//     }).compile();

//     userservice = module.get<UserService>(UserService);
//     prismaservice = module.get<PrismaService>(PrismaService);
//     jest.clearAllMocks();
//   });

//   /* ******************************************* */

//   describe('findAll: it should return the list of all user present in the db', () => {
//     describe('when function findAll is called', () => {
//       let users;

//       // beforeEach(async () => {
//       //   // console.log(tok);
//       // });
//       test('then it should call prismaservice', async () => {
//         users = await userservice.findAll();
//         expect(prismaservice.user.findMany).toHaveBeenCalled();
//         expect(users).toEqual(Allusers);
//       });
//     });
//   });

//   /* ******************************************* */
// });
