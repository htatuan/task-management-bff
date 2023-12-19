import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { Task } from 'src/proto/task';
import { TaskType } from './task.type';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

describe('TaskResolver', () => {
  let resolver: TaskResolver;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useValue: {
            findAllTasks: jest.fn(),
            searchTask: jest.fn(),
            removeTask: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllTasks', () => {
    it('should return tasks for a specific owner', async () => {
      const ownerId = 1;
      const expectedResult: Task[] = [
        {
          createdAt: 'createdAt',
          id: 1,
          ownerId: 1,
          status: 'TO DO',
          title: 'New Task',
          updatedAt: 'UpdatedAt',
        },
      ];

      jest.spyOn(taskService, 'findAllTasks').mockResolvedValue(expectedResult);

      const result = await resolver.findAllTasks(ownerId);

      expect(result).toBe(expectedResult);
      expect(taskService.findAllTasks).toHaveBeenCalledWith({ ownerId });
    });
  });

  describe('searchTask', () => {
    it('should return tasks based on a keyword', async () => {
      const keyword = 'searchKeyword';
      const user = { userId: 1 };
      const expectedResult: Task[] = [
        {
          createdAt: 'createdAt',
          id: 1,
          ownerId: 1,
          status: 'TO DO',
          title: 'New Task',
          updatedAt: 'UpdatedAt',
        },
      ];

      jest.spyOn(taskService, 'searchTask').mockResolvedValue(expectedResult);

      const result = await resolver.searchTask(keyword, user);

      expect(result).toBe(expectedResult);
      expect(taskService.searchTask).toHaveBeenCalledWith({
        keyword,
        ownerId: user.userId,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 1;
      const expectedResult = true;

      jest.spyOn(taskService, 'removeTask').mockResolvedValue(expectedResult);

      const result = await resolver.deleteTask(taskId);

      expect(result).toBe(expectedResult);
      expect(taskService.removeTask).toHaveBeenCalledWith({ id: taskId });
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskInput: CreateTaskInput = {
        title: 'Create new task',
        status: 'TO DO',
      };
      const user = { userId: 1 };
      const expectedResult: Task = {
        createdAt: 'createdAt',
        id: 1,
        ownerId: 1,
        status: 'TO DO',
        title: 'New Task',
        updatedAt: 'UpdatedAt',
      };

      jest.spyOn(taskService, 'createTask').mockResolvedValue(expectedResult);

      const result = await resolver.createTask(createTaskInput, user);
      expect(result).toBe(expectedResult);
      expect(taskService.createTask).toHaveBeenCalledWith({
        title: createTaskInput.title,
        status: createTaskInput.status,
        ownerId: user.userId,
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateTaskInput: UpdateTaskInput = { id: 1, status: 'IN PROGRESS' };
      const expectedResult: Task = {
        createdAt: 'createdAt',
        id: 1,
        ownerId: 1,
        status: 'TO DO',
        title: 'New Task',
        updatedAt: 'UpdatedAt',
      };

      jest.spyOn(taskService, 'updateTask').mockResolvedValue(expectedResult);

      const result = await resolver.updateTask(updateTaskInput);

      expect(result).toBe(expectedResult);
      expect(taskService.updateTask).toHaveBeenCalledWith(updateTaskInput);
    });
  });
});
