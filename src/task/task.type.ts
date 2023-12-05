import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Task')
export class TaskType {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  status: string;

  @Field()
  ownerId: string;
}
