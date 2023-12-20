import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard, GqlExecutionContext],
    }).compile();
    jwtAuthGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });
  describe('getRequest', () => {
    it('should return the request from the GraphQL context', () => {
      // Mock ExecutionContext
      const contextMock: ExecutionContext = {
        switchToHttp: jest.fn(),
      } as unknown as ExecutionContext;
      // Mock GqlExecutionContext
      const gqlContextMock = {
        getContext: jest.fn(() => ({
          req: { accessToken: 'token' },
        })),
      };

      // Mock GqlExecutionContext.create to return the mock context
      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(gqlContextMock as any);

      // Call the getRequest method
      const request = jwtAuthGuard.getRequest(contextMock);

      // Expectations
      expect(request).toBeDefined();
      expect(request).toEqual({
        accessToken: 'token',
      });

      // Verify that GqlExecutionContext.create was called with the correct argument
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(contextMock);
    });
  });
});
