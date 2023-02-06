import { Test } from '@nestjs/testing';
import { Task, TaskStatus } from '../database/tasks.entity';
import { User } from 'src/database/user.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

describe('TaskssController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;
  const mockUser = {
    id: 1,
    username: 'chidex',
  } as User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useFactory: jest.fn() },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    tasksController = moduleRef.get<TasksController>(TasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const mockTask = [{ title: 'test', description: 'test' }] as Task[];

      jest.spyOn(tasksService, 'getAll').mockResolvedValue(mockTask);

      const filter: TaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search',
      };

      const result = await tasksController.getAllTasks(filter, mockUser);

      expect(result).toBe(mockTask);
    });
  });

  describe('createTask', () => {
    it('should return created task', async () => {
      const mockTask = { title: 'test', description: 'test' } as Task;

      jest.spyOn(tasksService, 'createTask').mockResolvedValue(mockTask);

      const result = await tasksController.createTask(mockTask, mockUser);

      expect(result).toBe(mockTask);
    });
  });

  describe('getTask', () => {
    it('should return task', async () => {
      const mockTask = { id: 1, title: 'test', description: 'test' } as Task;

      jest.spyOn(tasksService, 'getTaskById').mockResolvedValue(mockTask);

      const result = await tasksController.getTask(mockTask.id, mockUser);

      expect(result).toBe(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      jest.spyOn(tasksService, 'deleteTask').mockResolvedValue(null);

      const result = await tasksController.deleteTask(1, mockUser);

      expect(result).toBe(null);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task', async () => {
      const mockTask = { id: 1, title: 'test', description: 'test' } as Task;

      jest.spyOn(tasksService, 'updateTaskStatus').mockResolvedValue(mockTask);

      const result = await tasksController.updateTaskStatus(
        TaskStatus.DONE,
        1,
        mockUser,
      );

      expect(result).toBe(mockTask);
    });
  });
});
