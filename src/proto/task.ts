/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'task';

export interface SearchRequest {
  keyword: string;
  ownerId: number;
}

export interface RemoveTaskResponse {
  isSuccess: boolean;
}

export interface OwnerId {
  ownerId: number;
}

export interface UpdateTaskDto {
  id: number;
  status: string;
}

export interface TaskId {
  id: number;
}

export interface Tasks {
  Tasks: Task[];
}

export interface CreateTaskDto {
  title: string;
  status: string;
  ownerId: number;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export const TASK_PACKAGE_NAME = 'task';

export interface TaskServiceClient {
  createTask(request: CreateTaskDto): Observable<Task>;

  findAllTasks(request: OwnerId): Observable<Tasks>;

  updateTask(request: UpdateTaskDto): Observable<Task>;

  removeTask(request: TaskId): Observable<RemoveTaskResponse>;

  searchTask(request: SearchRequest): Observable<Tasks>;
}

export interface TaskServiceController {
  createTask(request: CreateTaskDto): Promise<Task> | Observable<Task> | Task;

  findAllTasks(request: OwnerId): Promise<Tasks> | Observable<Tasks> | Tasks;

  updateTask(request: UpdateTaskDto): Promise<Task> | Observable<Task> | Task;

  removeTask(
    request: TaskId,
  ):
    | Promise<RemoveTaskResponse>
    | Observable<RemoveTaskResponse>
    | RemoveTaskResponse;

  searchTask(
    request: SearchRequest,
  ): Promise<Tasks> | Observable<Tasks> | Tasks;
}

export function TaskServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createTask',
      'findAllTasks',
      'updateTask',
      'removeTask',
      'searchTask',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('TaskService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('TaskService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const TASK_SERVICE_NAME = 'TaskService';
