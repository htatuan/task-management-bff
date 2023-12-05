import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateTaskDto,
  OwnerId,
  TASK_SERVICE_NAME,
  TaskId,
  TaskServiceClient,
  UpdateTaskDto,
} from './proto/task';
import { ClientGrpc } from '@nestjs/microservices';

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

  findOneTask(id: TaskId) {
    return this.taskService.findOneTask(id);
  }

  findAllTask(ownerId: OwnerId) {
    return this.taskService.findAllTasks(ownerId);
  }

  updateTask(updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(updateTaskDto);
  }

  removeTask(taskId: TaskId) {
    return this.taskService.removeTask(taskId);
  }
}
