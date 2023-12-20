import { Test, TestingModule } from '@nestjs/testing';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

describe('GQLAuthGuard', () => {
  let gqlAuthGuard: GqlAuthGuard;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [GqlAuthGuard, GqlExecutionContext],
    }).compile();
    gqlAuthGuard = moduleRef.get<GqlAuthGuard>(GqlAuthGuard);
  });

  it('should be defined', () => {
    expect(gqlAuthGuard).toBeDefined();
  });
  describe('getRequest', () => {
    it('should return the request from the GraphQL context', () => {
      // Mock ExecutionContext
      const contextMock: ExecutionContext = {
        switchToHttp: jest.fn(),
      } as unknown as ExecutionContext;
      const loginInput = {
        username: 'admin',
        password: 'password',
      };
      // Mock GqlExecutionContext
      const gqlContextMock = {
        getContext: jest.fn(() => ({
          body: {},
        })),
        getArgs: jest.fn(() => ({
          loginInput,
        })),
      };

      // Mock GqlExecutionContext.create to return the mock context
      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(gqlContextMock as any);

      // Call the getRequest method
      const request = gqlAuthGuard.getRequest(contextMock);

      // Expectations
      expect(request).toBeDefined();
      expect(request.body).toEqual({
        username: 'admin',
        password: 'password',
      });

      // Verify that GqlExecutionContext.create was called with the correct argument
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(contextMock);
    });
  });
});
