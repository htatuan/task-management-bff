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
import { lastValueFrom } from 'rxjs';
import { GraphQLError } from 'graphql';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskService: TaskServiceClient;

  constructor(@Inject(TASK_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.taskService =
      this.client.getService<TaskServiceClient>(TASK_SERVICE_NAME);
  }
  create(createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  async findOneTask(id: TaskId): Promise<Task> {
    try {
      const res = await lastValueFrom(this.taskService.findOneTask(id));

      return res;
    } catch (error) {
      throw new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  async findAllTask(ownerId: OwnerId): Promise<Task[]> {
    try {
      const res = await lastValueFrom(this.taskService.findAllTasks(ownerId));
      if (!res.Tasks) {
        return [];
      }
      return res.Tasks;
    } catch (error) {
      throw new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }

  updateTask(updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(updateTaskDto);
  }

  async removeTask(taskId: TaskId): Promise<boolean> {
    try {
      const res = await lastValueFrom(this.taskService.removeTask(taskId));

      return res.isSuccess;
    } catch (error) {
      throw new GraphQLError(error.details, {
        extensions: { code: error.code },
      });
    }
  }
}
