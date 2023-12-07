import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @MinLength(6)
  @Field()
  username: string;

  @MinLength(8)
  @Field()
  password: string;
}
