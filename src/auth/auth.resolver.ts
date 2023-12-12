import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './types/login.response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { RegisterReponse } from './types/register.response';
import { RegisterInput } from './dto/register.input';
import { ForgotPasswordDto } from './dto/forgot-password.input';
import { ForgotPasswordResponse } from './types/forgot-password.reponse';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ResetPasswordResponse } from './types/reset-password.reponse';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    return this.authService.login(context.user);
  }

  @Mutation(() => RegisterReponse)
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => ForgotPasswordResponse)
  forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => ResetPasswordResponse)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
