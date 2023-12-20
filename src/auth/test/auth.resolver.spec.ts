import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { createUserStub } from 'src/users/test/stubs/user.stub';
import { isGuarded } from 'src/shared/test/utils/isGuarded';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { mock_access_token, mock_forgot_password_token } from './mocks/tokens.mock';

jest.mock('../auth.service.ts');
describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, AuthService],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      jest
        .spyOn(authService, 'register')
        .mockResolvedValueOnce(createUserStub());
      const response = await authResolver.register({
        username: 'admin',
        password: '12345678',
        email: 'admin@example.com',
      });
      expect(response).toEqual(createUserStub());
    });
  });

  describe('login', () => {
    it('should be protected with LocalAuthGuard', () => {
      expect(isGuarded(AuthResolver.prototype.login, GqlAuthGuard));
    });
    it('should login successfully and return an access token, information of user', async () => {
      // Arrange
      const context = { user: createUserStub() };
      jest.spyOn(authService, 'login').mockReturnValueOnce({
        accessToken: 'mock_access_token',
        user: createUserStub(),
      });
      // Act
      const response = authResolver.login(
        {
          username: 'admin',
          password: '12345678',
        },
        context,
      );

      // Assert
      expect(response).toEqual({
        accessToken: mock_access_token,
        user: createUserStub(),
      });
    });
  });

  describe('forgotPassword', () => {
    it('should return a message : Your forgot password request succesfully!', async () => {
      jest.spyOn(authService, 'forgotPassword').mockResolvedValueOnce({
        message: 'Your forgot password request succesfully!',
      });
      const response = await authResolver.forgotPassword({
        email: 'admin@example.com',
      });
      expect(response).toEqual({
        message: 'Your forgot password request succesfully!',
      });
    });
  });

  describe('resetPassword', () => {
    it('should return a message : Reset password succesfully', async () => {
      jest.spyOn(authService, 'resetPassword').mockResolvedValueOnce({
        message: 'Reset password succesfully',
      });
      const response = await authResolver.resetPassword({
        password: '12345678',
        forgotPasswordToken: mock_forgot_password_token
      });
      expect(response).toEqual({
        message: 'Reset password succesfully',
      });
    });
  });
});
