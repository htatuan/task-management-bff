import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './types/user.input';
import { JwtService } from '@nestjs/jwt';

@Resolver((of) => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Query(() => UserType)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    var user = await this.authService.login(username, password);
    const accessToken: string = this.jwtService.sign({ username });
    return { ...user, accessToken };
  }

  @Mutation((returns) => UserType)
  async register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.create(createUserInput);
  }
}
