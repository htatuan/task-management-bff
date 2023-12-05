import { Args, Query, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { TaskId } from './proto/task';
import { ParseIntPipe } from '@nestjs/common';

@Resolver((of) => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query((returns) => TaskType)
  async task(@Args('id', ParseIntPipe) id: number) {
    try {
      const taskId: TaskId = { id };
      const a = this.taskService.findOneTask(taskId);
      console.log(a);
      return a;
    } catch (error) {
      console.log('error');
    }
  }
}
