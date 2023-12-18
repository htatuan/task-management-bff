import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createUserStub } from 'src/users/test/stubs/user.stub';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { mockJwtService } from './mocks/jwt.mock';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import {
  mock_forgot_password_token,
  mock_token,
  verifiedToken,
} from './mocks/tokens.mock';
import { sendMailStub } from 'src/email/test/stubs/email.stub';
import * as bcrypt from 'bcrypt';

jest.mock('../../users/users.service');
jest.mock('../../email/email.service');
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let emailService: EmailService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        ConfigService,
        EmailService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('register', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      const userStub = createUserStub();
      userStub.username = 'user';
      jest
        .spyOn(usersService, 'create')
        .mockImplementationOnce(() => Promise.reject(new ConflictException()));
      // Act && Assert
      const register = authService.register(userStub);
      await expect(register).rejects.toThrow(ConflictException);
    });

    it('should throw a ConflictException if user with username already exists', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'create')
        .mockImplementationOnce(() => Promise.reject(new ConflictException()));
      const userStub = createUserStub();
      userStub.email = 'user@gmail.com';
      // Act && Assert
      const register = authService.register(userStub);
      await expect(register).rejects.toThrow(ConflictException);
    });
    it('should successfully create and return a new user if email and username is not taken', async () => {
      // Arrange
      const newUser = {
        email: 'admin@example.com',
        username: 'admin',
        password: '12345678',
      };
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce(createUserStub());
      // Act && Assert
      const result = await authService.register(newUser);
      expect(result).toEqual(createUserStub());
    });
  });

  describe('login', () => {
    it('should return access token and information of user', async () => {
      // Arrange
      const userStub = createUserStub();
      //Act
      const result = authService.login(userStub);
      //Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: userStub.username,
        sub: userStub.id,
      });
      expect(result).toStrictEqual({ accessToken: mock_token, user: userStub });
    });
  });

  describe('forgotPassword', () => {
    it('should throw a BadRequestException if the email does not exist', async () => {
      //Arrange
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(null);
      //Act
      await expect(
        authService.forgotPassword({ email: 'admin@gmail.com' }),
      ).rejects.toThrow(BadRequestException);
    });
    it('should send an email for reset password and return a successful message', async () => {
      //Arrange
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce(createUserStub());
      jest
        .spyOn(authService, 'generateForgotPasswordLink')
        .mockResolvedValueOnce(mock_forgot_password_token);
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('http://localhost:3001');
      //Act
      const result = await authService.forgotPassword({
        email: 'admin@example.com',
      });
      //Assert
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        'admin@example.com',
      );
      expect(authService.generateForgotPasswordLink).toHaveBeenCalledWith({
        email: 'admin@example.com',
        id: 1,
        username: 'admin',
      });
      expect(emailService.sendMail).toHaveBeenCalledWith(sendMailStub());
      expect(result).toEqual({
        message: 'Your forgot password request succesfully!',
      });
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException if token is invalid or expired', async () => {
      //Arrange
      jest
        .spyOn(jwtService, 'verify')
        .mockImplementationOnce(() => new BadRequestException());
      //Act && Assert
      await expect(authService.resetPassword).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw BadRequestException if user does not exist', async () => {
      //Arrange
      jest
        .spyOn(jwtService, 'verify')
        .mockImplementationOnce(() => verifiedToken);
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => 'hashedPassword');
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(null);
      //Act && Assert
      await expect(authService.resetPassword).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return a message: Reset password succesfully', async () => {
      //Arrange
      jest.spyOn(configService, 'get').mockReturnValue('forgotsecret');
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(() => verifiedToken);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValueOnce(createUserStub());
      //Act
      const result = await authService.resetPassword({
        password: '12345678',
        forgotPasswordToken: 'token',
      });
      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith('token', {
        secret: 'forgotsecret',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 10);
      expect(usersService.findOneByUsername).toHaveBeenCalledWith('admin');
      expect(result).toEqual({
        message: 'Reset password succesfully',
      });
    });
  });
});
