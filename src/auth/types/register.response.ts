import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterReponse {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}
