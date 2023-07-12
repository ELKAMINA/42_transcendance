// import { Test, TestingModule } from '@nestjs/testing';

// import { Allusers } from './stubs/index';
// import { UserController } from '../user.controller';
// import { UserService } from '../user.service';

// jest.mock('../user.service.ts');

// describe('UserController', () => {
//   let usercontroller: UserController;
//   let userservice: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     usercontroller = module.get<UserController>(UserController);
//     userservice = module.get<UserService>(UserService);
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(usercontroller).toBeDefined();
//   });

//   /* ******************************************* */

//   describe('findAll: it should call the findAll function from the UserService', () => {
//     describe('when function findAll is called', () => {
//       let users;

//       beforeEach(async () => {
//         users = await usercontroller.findAll();
//         // console.log(tok);
//       });

//       test('then it should call UserService', () => {
//         expect(userservice.findAll).toBeCalled();
//       });

//       test('then it should return an object of faEnabled and tokens', () => {
//         expect(users).toEqual(Allusers);
//       });
//     });
//   });

//   /* ******************************************* */

// });
