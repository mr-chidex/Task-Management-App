import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: TaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAll();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDTO): Task {
    const { title, description } = createTaskDto;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  geTask(taskId: string) {
    const taskInd = this.findOne(taskId);
    return this.tasks[taskInd];
  }

  findOne(id: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex < 0) throw new NotFoundException('task not found');
    return taskIndex;
  }

  deleteTask(id: string) {
    const taskInd = this.findOne(id);
    const task = this.tasks[taskInd];

    this.tasks.splice(taskInd, 1);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.geTask(id);

    task.status = status;

    return task;
  }
}
