import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateTaskInput{
    @Field()
    @IsNotEmpty()
    @IsInt()
    id: number;
    @Field()
    @IsNotEmpty()
    @IsString()
    status: string;
}