// import { Allusers } from 'src/user/test/stubs';
// import { newUser, userRegistered } from '../../auth/test/stubs/stubs.stub';

// export const PrismaService = jest.fn().mockReturnValue({
//   user: {
//     update: jest
//       .fn()
//       .mockResolvedValueOnce('')
//       .mockResolvedValueOnce('')
//       .mockResolvedValueOnce('')
//       .mockResolvedValueOnce('')
//       .mockResolvedValueOnce('')
//       .mockResolvedValueOnce('')
//       .mockRejectedValueOnce(new Error('Record not found'))
//       .mockResolvedValueOnce(''),
//     create: jest
//       .fn()
//       .mockResolvedValueOnce(newUser())
//       .mockRejectedValueOnce(new Error('Credentials taken'))
//       .mockResolvedValueOnce(userRegistered()),
//     findUniqueOrThrow: jest
//       .fn()
//       .mockResolvedValueOnce(newUser())
//       .mockRejectedValueOnce(new Error('No user found')),
//     updateMany: jest
//       .fn()
//       .mockResolvedValueOnce(newUser())
//       .mockRejectedValueOnce(new Error('ko')),
//     findUnique: jest
//       .fn()
//       .mockResolvedValueOnce(userRegistered())
//       .mockRejectedValueOnce(new Error('Access Denied'))
//       .mockResolvedValueOnce(userRegistered())
//       .mockRejectedValueOnce(new Error('Record not found')),
//     findMany: jest.fn().mockResolvedValueOnce(Allusers),
//   },
// });
