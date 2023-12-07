import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const gqlcontext = GqlExecutionContext.create(ctx);
    const req = gqlcontext.getContext().req;
    return req.user;
  },
);
