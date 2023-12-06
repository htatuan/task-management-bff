import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { Task } from './proto/task';
import { ParseIntPipe } from '@nestjs/common';

@Resolver((of) => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => TaskType)
  async task(@Args('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.findOneTask({ id });
  }

  @Query(() => [TaskType])
  async tasks(@Args('ownerId', ParseIntPipe) ownerId: number): Promise<Task[]> {
    return this.taskService.findAllTask({ ownerId });
  }

  @Mutation(() => Boolean)
  async delete(@Args('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.taskService.removeTask({ id });
  }
}
