import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
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
    return this.findOne(taskId);
  }

  findOne(id: string) {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) throw new NotFoundError('task not found');

    return task;
  }
}
