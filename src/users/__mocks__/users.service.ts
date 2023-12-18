import { createUserStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(createUserStub()),
  findOneByEmail: jest.fn().mockResolvedValue(createUserStub()),
  findOneByUsername: jest.fn().mockResolvedValue(createUserStub()),
  resetPassword: jest.fn().mockResolvedValue(null),
});
