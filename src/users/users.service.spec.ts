import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create and return that user', async () => {
      //arrange
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      };
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(mockUserRepository, 'create').mockResolvedValue(user);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(user);

      // act
      const result = await service.create(user);

      // assert
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('Should throw ConflictException if duplicate username or email', async () => {
      //arrange
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      };
      jest.spyOn(mockUserRepository, 'save').mockImplementation(() => {
        throw { code: '23505', detail: 'test message' };
      });

      // assert
      await expect(service.create(user)).rejects.toThrow(
        new ConflictException('test message'),
      );
    });

    it('Should throw InternalServerErrorException if can not create user', async () => {
      //arrange
      const user = {
        username: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      };
      jest.spyOn(mockUserRepository, 'save').mockImplementation(() => {
        throw { code: '1', detail: 'test message' };
      });

      // assert
      await expect(service.create(user)).rejects.toThrow(
        new InternalServerErrorException('test message'),
      );
    });
  });

  describe('findOneByUsername', () => {
    it('Should return user by username', async () => {
      const username = 'test';
      jest
        .spyOn(mockUserRepository, 'findOneBy')
        .mockResolvedValue({ username });

      // act
      const result = await service.findOneByUsername(username);

      // assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ username });
      expect(result.username).toEqual(username);
    });
  });

  describe('findOneByEmail', () => {
    it('Should return user by email', async () => {
      const email = 'test@gmail.com';
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue({ email });

      // act
      const result = await service.findOneByEmail(email);

      // assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result.email).toEqual(email);
    });
  });

  describe('findAll', () => {
    it('Should return array of users', async () => {
      //arrange
      const users = [
        {
          id: 1,
          username: 'test',
          email: 'test@gmail.com',
          password: '123123',
        },
      ];
      jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

      // act
      const result = await service.findAll();

      // assert
      expect(mockUserRepository.findOneBy).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('resetPassword', () => {
    it('Should update password successfully', async () => {
      //arrange
      jest
        .spyOn(mockUserRepository, 'update')
        .mockResolvedValue({ affected: 1, raw: null });

      // act
      const result = await service.resetPassword(1, '123456789');

      // assert
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result.affected).toEqual(1);
    });
  });
});
