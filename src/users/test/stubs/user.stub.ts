import { User } from 'src/users/entities/user.entity';

export const createUserStub = (): User => {
  return {
    id: 1,
    email: 'admin@example.com',
    username: 'admin',
    password: '12345678',
  };
};
