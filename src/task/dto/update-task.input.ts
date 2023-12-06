import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateTaskInput{
    @Field()
    id: number;
    @Field()
    status: string;
}