import { Args, Query, Resolver } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { TaskId } from './proto/task';
import { ParseIntPipe } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GraphQLError } from 'graphql';

@Resolver((of) => TaskType)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query((returns) => TaskType)
  async task(@Args('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const taskId: TaskId = { id };
      const a = await firstValueFrom(this.taskService.findOneTask(taskId));

      return a;
    } catch (error) {
      console.log("error => ", error)
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }
}
