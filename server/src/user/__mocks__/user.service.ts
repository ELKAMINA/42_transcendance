import { user } from '../../auth/test/stubs/stubs.stub';

export const UserService = jest.fn().mockReturnValue({
  searchUser: jest.fn().mockResolvedValue(user()),
});
