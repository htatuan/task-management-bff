import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { Task, TaskId } from './proto/task';
import { ParseIntPipe } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GraphQLError } from 'graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => TaskType)
  async findTask(@Args('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const taskId: TaskId = { id };
      const a = await firstValueFrom(this.taskService.findOneTask(taskId));

      return a;
    } catch (error) {
      console.log('error => ', error);
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  @Mutation(() => TaskType)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task | GraphQLError> {
    return await this.taskService.createTask(createTaskInput);
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task | GraphQLError> {
    return this.taskService.updateTask(updateTaskInput);
  }
}
