import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateTaskInput{
    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;
    @Field()
    @IsNotEmpty()
    @IsString()
    status: string;
    @Field()
    @IsNotEmpty()
    @IsInt()
    ownerId: number;
}