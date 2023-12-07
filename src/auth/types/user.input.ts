import { InputType, Field } from '@nestjs/graphql';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Field()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @Field()
  password: string;
}
