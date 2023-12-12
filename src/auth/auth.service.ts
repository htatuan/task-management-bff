import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { ForgotPasswordDto } from './dto/forgot-password.input';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordInput } from './dto/reset-password.input';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        user.password = undefined;
        return user;
      }
    }
    return null;
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    console.log(accessToken);
    return {
      accessToken,
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    return this.userService.create(registerInput);
  }

  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      { user },
      {
        secret: this.configService.get('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    delete user.password;
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);
    const resetPasswordUrl =
      this.configService.get('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;
    await this.emailService.sendMail({
      email: user.email,
      subject: 'Reset your password!',
      template: './forgot-password',
      name: user.username,
      activationCode: resetPasswordUrl,
    });
    return { message: 'Your forgot password request succesfully!' };
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    try {
      const verifiedToken = await this.jwtService.verify(
        resetPasswordInput.forgotPasswordToken,
        {
          secret: this.configService.get('FORGOT_PASSWORD_SECRET'),
        },
      );
      const hashedPassword = await bcrypt.hash(resetPasswordInput.password, 10);

      const user = await this.userService.findOneByUsername(
        verifiedToken.user.username,
      );
      if (user) {
        await this.userService.resetPassword(
          verifiedToken.user.id,
          hashedPassword,
        );
        return { message: 'Reset password succesfully' };
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
