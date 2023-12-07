import { Args, Query, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { TaskId } from './proto/task';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/graphql.auth.guard';

@Resolver((of) => TaskType)
@UseGuards(GqlAuthGuard)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query((returns) => TaskType)
  async task(@Args('id', ParseIntPipe) id: number) {
    try {
      const taskId: TaskId = { id };
      return this.taskService.findOneTask(taskId);
    } catch (error) {
      console.log(error);
    }
  }
}
