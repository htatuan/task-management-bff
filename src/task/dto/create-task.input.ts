import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTaskInput{
    @Field()
    title: string;
    @Field()
    status: string;
    @Field()
    ownerId: number;
}