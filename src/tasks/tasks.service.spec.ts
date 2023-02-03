import { Test } from '@nestjs/testing';
import { Task, TaskStatus } from '../database/tasks.entity';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskFilterDto } from './dto/task-filter.dto';
import { User } from 'src/database/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

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
      getMany: jest.fn(() => 'allTask'),
    })),
    create: jest.fn(() => ({ save: jest.fn(() => 'someTask') })),
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
    it('should get all tasks', async () => {
      expect(taskRepository.createQueryBuilder).not.toHaveBeenCalled();

      //call taskService.getAll
      const filters: TaskFilterDto = {
        status: TaskStatus.DONE,
        search: 'search query',
      };

      const result = await tasksService.getAll(filters, mockUser);

      //expect taskRepository.creteQueryBuilder to have been called
      expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual('allTask');
    });
  });

  describe('createTask', () => {
    it('should successfully create a new task', async () => {
      expect(taskRepository.create).not.toHaveBeenCalled();

      const task: CreateTaskDTO = {
        title: 'test title',
        description: 'test description',
      };

      const result = await tasksService.createTask(task, mockUser);

      expect(taskRepository.create).toHaveBeenCalled();
      expect(taskRepository.create).toHaveBeenCalledWith({
        ...task,
        userId: mockUser.id,
      });
      expect(result).toEqual('someTask');
    });
  });

  describe('getTaskById', () => {
    it('should successfully retrieve task', async () => {
      const mockTask = { title: 'test title', description: 'test description' };

      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw NotFoundError if task not found', () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow();
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete task with id', async () => {
      const remove = jest.fn().mockResolvedValue(true);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        remove,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      await tasksService.deleteTask(1, mockUser);

      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(remove).toHaveBeenCalled();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      const resolvedValue = {
        status: '',
        save,
      };

      tasksService.getTaskById = jest.fn().mockResolvedValue(resolvedValue);

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );

      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(resolvedValue);
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
