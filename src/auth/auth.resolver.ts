import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserType } from './types/user.type';
import { CreateUserInput } from './types/user.input';
import { JwtService } from '@nestjs/jwt';
import { credentials } from '@grpc/grpc-js';
import { CredentialsInput } from './types/credentials.input';

@Resolver((of) => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Mutation(() => UserType)
  async login(@Args('credentials') credentialsInput: CredentialsInput) {
    const { username, password } = credentialsInput;
    var user = await this.authService.login(username, password);
    const accessToken: string = this.jwtService.sign({ username });
    return { ...user, accessToken };
  }

  @Mutation((returns) => UserType)
  async register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.create(createUserInput);
  }
}
