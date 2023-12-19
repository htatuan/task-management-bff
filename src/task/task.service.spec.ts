import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  OwnerId,
  SearchRequest,
  Task,
  TaskId,
  TaskServiceClient,
  UpdateTaskDto,
} from 'src/proto/task';
import { of } from 'rxjs/internal/observable/of';
import { GraphQLError } from 'graphql';

const TASK_SERVICE_NAME = 'TaskService';

const mockTaskServiceClient = {
  createTask: jest.fn(),
  searchTask: jest.fn(),
  findAllTasks: jest.fn(),
  updateTask: jest.fn(),
  removeTask: jest.fn(),
};

const mockClientGrpc = {
  getService: jest.fn(() => mockTaskServiceClient),
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,

        { provide: TASK_SERVICE_NAME, useValue: mockClientGrpc },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        ownerId: 1,
        status: 'TO DO',
        title: 'New Task',
      };
      const expectedResult: Task = {
        id: 1,
        title: 'New Task',
        status: 'TO DO',
        ownerId: 1,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };
      mockTaskServiceClient.createTask.mockReturnValueOnce(of(expectedResult));

      const result = await service.createTask(createTaskDto);

      expect(mockTaskServiceClient.createTask).toHaveBeenCalledWith(
        createTaskDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when creating a task', async () => {
      // Arrange
      const createTaskDto: CreateTaskDto = {
        ownerId: 1,
        status: 'TO DO',
        title: 'New Task',
      };
      const mockError = new GraphQLError('Some error');

      mockTaskServiceClient.createTask.mockReturnValueOnce(
        of(Promise.reject(mockError)),
      );

      const result = await service.createTask(createTaskDto);

      expect(result).toBeInstanceOf(GraphQLError);
      expect(mockTaskServiceClient.createTask).toHaveBeenCalledWith(
        createTaskDto,
      );
    });
  });

  describe('searchTask', () => {
    it('should search for tasks successfully', async () => {
      const searchRequest: SearchRequest = { keyword: 'keyword', ownerId: 1 };
      const mockSearchResponse = {
        Tasks: [
          {
            createdAt: 'createdAt',
            id: 1,
            ownerId: 1,
            status: 'TO DO',
            title: 'New Task',
            updatedAt: 'updatedAt',
          },
        ],
      };
      mockTaskServiceClient.searchTask.mockReturnValueOnce(
        of(mockSearchResponse),
      );

      // Act
      const result = await service.searchTask(searchRequest);

      expect(result).toEqual(mockSearchResponse.Tasks);
      expect(mockTaskServiceClient.searchTask).toHaveBeenCalledWith(
        searchRequest,
      );
    });

    it('should search for empty tasks successfully', async () => {
      const searchRequest: SearchRequest = { keyword: 'keyword', ownerId: 1 };
      const mockSearchResponse = {
        Tasks: [],
      };
      mockTaskServiceClient.searchTask.mockReturnValueOnce(
        of(mockSearchResponse),
      );

      // Act
      const result = await service.searchTask(searchRequest);

      expect(result).toEqual(mockSearchResponse.Tasks);
      expect(mockTaskServiceClient.searchTask).toHaveBeenCalledWith(
        searchRequest,
      );
    });

    it('should handle errors when searching for tasks', async () => {
      const searchRequest: SearchRequest = { keyword: 'keyword', ownerId: 1 };
      const mockError = new Error('Some error');

      mockTaskServiceClient.searchTask.mockReturnValueOnce(
        of(Promise.reject(mockError)),
      );

      const result = await service.searchTask(searchRequest);

      expect(result).toBeInstanceOf(GraphQLError);
      expect(mockTaskServiceClient.searchTask).toHaveBeenCalledWith(
        searchRequest,
      );
    });
  });

  describe('searchAllTask', () => {
    it('should find all tasks for a specific owner successfully', async () => {
      const ownerId: OwnerId = { ownerId: 1 };
      const mockFindAllResponse = {
        Tasks: [
          {
            createdAt: 'createdAt',
            id: 1,
            ownerId: 1,
            status: 'TO DO',
            title: 'New Task',
            updatedAt: 'updatedAt',
          },
        ],
      };

      mockTaskServiceClient.findAllTasks.mockReturnValueOnce(
        of(mockFindAllResponse),
      );

      const result = await service.findAllTasks(ownerId);

      // Assert
      expect(result).toEqual(mockFindAllResponse.Tasks || []);
      expect(mockTaskServiceClient.findAllTasks).toHaveBeenCalledWith(ownerId);
    });

    it('should return an empty array if no tasks are found for a specific owner', async () => {
      const ownerId: OwnerId = { ownerId: 1 };
      const mockEmptyFindAllResponse = { Tasks: null };

      mockTaskServiceClient.findAllTasks.mockReturnValueOnce(
        of(mockEmptyFindAllResponse),
      );

      const result = await service.findAllTasks(ownerId);

      expect(result).toEqual([]);
      expect(mockTaskServiceClient.findAllTasks).toHaveBeenCalledWith(ownerId);
    });

    it('should handle errors when finding all tasks for a specific owner', async () => {
      const ownerId: OwnerId = { ownerId: 1 };
      const mockError = new Error('Some error');

      mockTaskServiceClient.findAllTasks.mockReturnValueOnce(
        of(Promise.reject(mockError)),
      );

      const result = await service.findAllTasks(ownerId);

      expect(result).toBeInstanceOf(GraphQLError);
      expect(mockTaskServiceClient.findAllTasks).toHaveBeenCalledWith(ownerId);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = { id: 1, status: 'IN PROGRESS' };
      const mockUpdateResponse: Task = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        id: 1,
        ownerId: 1,
        status: 'IN PROGRESS',
        title: 'Task title',
      };

      mockTaskServiceClient.updateTask.mockReturnValueOnce(
        of(mockUpdateResponse),
      );

      const result = await service.updateTask(updateTaskDto);

      expect(result).toEqual(mockUpdateResponse);
      expect(mockTaskServiceClient.updateTask).toHaveBeenCalledWith(
        updateTaskDto,
      );
    });

    it('should handle errors when updating a task', async () => {
      const updateTaskDto: UpdateTaskDto = { id: 1, status: 'IN PROGRESS' };
      const mockError = new Error('Some error');

      mockTaskServiceClient.updateTask.mockReturnValueOnce(
        of(Promise.reject(mockError)),
      );

      const result = await service.updateTask(updateTaskDto);

      expect(result).toBeInstanceOf(GraphQLError);
      expect(mockTaskServiceClient.updateTask).toHaveBeenCalledWith(
        updateTaskDto,
      );
    });
  });

  describe('removeTask', () => {
    it('should remove a task successfully', async () => {
      const taskId: TaskId = { id: 1 };
      const mockRemoveResponse = { isSuccess: true };

      mockTaskServiceClient.removeTask.mockReturnValueOnce(
        of(mockRemoveResponse),
      );

      const result = await service.removeTask(taskId);

      expect(result).toEqual(true);
      expect(mockTaskServiceClient.removeTask).toHaveBeenCalledWith(taskId);
    });

    it('should handle errors when removing a task', async () => {
      const taskId: TaskId = { id: 1 };
      const mockError = new Error('Some error');

      mockTaskServiceClient.removeTask.mockReturnValueOnce(
        of(Promise.reject(mockError)),
      );

      const result = await service.removeTask(taskId);

      expect(result).toBeInstanceOf(GraphQLError);
      expect(mockTaskServiceClient.removeTask).toHaveBeenCalledWith(taskId);
    });
  });
});
