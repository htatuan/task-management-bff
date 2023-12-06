import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateTaskDto,
  OwnerId,
  TASK_SERVICE_NAME,
  Task,
  TaskId,
  TaskServiceClient,
  UpdateTaskDto,
} from './proto/task';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { GraphQLError } from 'graphql';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskService: TaskServiceClient;

  constructor(@Inject(TASK_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.taskService =
      this.client.getService<TaskServiceClient>(TASK_SERVICE_NAME);
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task | GraphQLError> {
    try {
      const task = await firstValueFrom(
        this.taskService.createTask(createTaskDto),
      );
      return task;
    } catch (error) {
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  async findOneTask(id: TaskId): Promise<Task | GraphQLError> {
    try {
      const res = await lastValueFrom(this.taskService.findOneTask(id));

      return res;
    } catch (error) {
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  async findAllTasks(ownerId: OwnerId): Promise<Task[] | GraphQLError> {
    try {
      const res = await lastValueFrom(this.taskService.findAllTasks(ownerId));
      if (!res.Tasks) {
        return [];
      }
      return res.Tasks;
    } catch (error) {
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto): Promise<Task | GraphQLError> {
    try {
      const task = await firstValueFrom(
        this.taskService.updateTask(updateTaskDto),
      );
      return task;
    } catch (error) {
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  async removeTask(taskId: TaskId): Promise<boolean | GraphQLError> {
    try {
      const res = await lastValueFrom(this.taskService.removeTask(taskId));

      return res.isSuccess;
    } catch (error) {
      return new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }
}
