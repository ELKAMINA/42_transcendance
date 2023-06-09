import { user } from '../../auth/test/stubs/stubs.stub';
import { Allusers } from '../test/stubs';

export const UserService = jest.fn().mockReturnValue({
  searchUser: jest.fn().mockResolvedValue(user()),
  findAll: jest
    .fn()
    .mockResolvedValueOnce(Allusers)
    .mockResolvedValueOnce(Allusers),
});
