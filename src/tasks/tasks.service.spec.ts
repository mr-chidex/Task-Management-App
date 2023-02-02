import { Test } from '@nestjs/testing';
import { Task, TaskStatus } from '../database/tasks.entity';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskFilterDto } from './dto/task-filter.dto';
import { User } from 'src/database/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';

describe('TaskService', () => {
  let tasksService: TasksService;
  let taskRepository: any;
  const mockUser = {
    id: 1,
    username: 'chidex',
  } as User;

  const mockTaskRepository = () => ({
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(),
      andWhere: jest.fn(),
      getMany: jest.fn(),
    })),
    create: jest.fn(() => ({ save: jest.fn() })),
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  describe('getAll Task', () => {
    it('should get all tasks', () => {
      expect(taskRepository.createQueryBuilder).not.toHaveBeenCalled();

      //call taskService.getAll
      const filters: TaskFilterDto = {
        status: TaskStatus.DONE,
        search: 'search query',
      };

      tasksService.getAll(filters, mockUser);

      //expect taskRepository.creteQueryBuilder to have been called
      expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should successfully create a new task', async () => {
      expect(taskRepository.create).not.toHaveBeenCalled();

      const task: CreateTaskDTO = {
        title: 'test title',
        description: 'test description',
      };

      tasksService.createTask(task, mockUser);

      expect(taskRepository.create).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should successfully retrive task', async () => {
      const task = { title: 'test title', description: 'test description' };

      taskRepository.findOne.mockResolvedValue(task);

      const result = await tasksService.getTaskById(1, mockUser);

      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw NotFoundError if task not found', () => {});
  });
});
