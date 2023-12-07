import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { Task } from './proto/task';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { GqlAuthGuard } from 'src/auth/graphql.auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => TaskType)
  async findOneTask(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<Task | GraphQLError> {
    return this.taskService.findOneTask({ id });
  }

  @Query(() => [TaskType])
  async findAllTasks(
    @Args('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<Task[] | GraphQLError> {
    return this.taskService.findAllTasks({ ownerId });
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id', ParseIntPipe) id: number,
  ): Promise<boolean | GraphQLError> {
    return this.taskService.removeTask({ id });
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
