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
import { firstValueFrom } from 'rxjs';
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

  findOneTask(id: TaskId) {
    return this.taskService.findOneTask(id);
  }

  findAllTask(ownerId: OwnerId) {
    return this.taskService.findAllTasks(ownerId);
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

  removeTask(taskId: TaskId) {
    return this.taskService.removeTask(taskId);
  }
}
