import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isNotEmpty,
} from 'class-validator';

@InputType('Credentials')
export class CredentialsInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}
