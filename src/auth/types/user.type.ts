import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  accessToken: string;
}
