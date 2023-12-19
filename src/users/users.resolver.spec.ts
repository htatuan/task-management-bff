import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@gmail.com',
        password: 'password',
        username: 'test',
      };
      const expectedResult: User = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password',
        username: 'test',
      };

      jest.spyOn(userService, 'create').mockResolvedValue(expectedResult);

      const result = await resolver.createUser(createUserInput);

      expect(result).toBe(expectedResult);
      expect(userService.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult: User[] = [
        {
          email: 'test@gmail.com',
          id: 1,
          password: 'password1',
          username: 'user1',
        },
        {
          email: 'test1@gmail.com',
          id: 2,
          password: 'password2',
          username: 'user2',
        },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(expectedResult);

      const result = await resolver.findAll();

      expect(result).toBe(expectedResult);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const expectedResult: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        email: 'email@gmail.com',
      };

      jest
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValue(expectedResult);

      const result = await resolver.findOne(username);

      expect(result).toBe(expectedResult);
      expect(userService.findOneByUsername).toHaveBeenCalledWith(username);
    });
  });
});
