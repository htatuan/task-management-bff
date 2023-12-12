import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const gqlcontext = GqlExecutionContext.create(ctx);
    const req = gqlcontext.getContext().req;
    return req.user;
  },
);
