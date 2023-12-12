import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { SearchRequest, Task } from '../proto/task';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
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
    @GetUser() user: User,
  ): Promise<Task[] | GraphQLError> {
    return this.taskService.findAllTasks({ ownerId });
  }

  @Query(() => [TaskType])
  async searchTask(
    @Args('keyword') keyword: string,
    @GetUser() user,
  ): Promise<Task[] | GraphQLError> {
    console.log(user);
    const searchRequest: SearchRequest = {
      keyword: keyword,
      ownerId: user.userId,
    };
    return this.taskService.searchTask(searchRequest);
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
    @GetUser() user,
  ): Promise<Task | GraphQLError> {
    createTaskInput.ownerId = user.userId;
    return await this.taskService.createTask(createTaskInput);
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task | GraphQLError> {
    return this.taskService.updateTask(updateTaskInput);
  }
}
