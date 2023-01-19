import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Task, TaskStatus } from '../database/tasks.entity';
import { User } from 'src/database/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAll(filterDto: TaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let query = this.taskRepository.createQueryBuilder('tasks');

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(tasks.title LIKE :search OR tasks.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const newTask = this.taskRepository
      .create({ ...createTaskDto, userId: user.id })
      .save();
    return newTask;
  }

  async getTaskById(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) throw new NotFoundException('task not found');

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.getTaskById(id);

    await task.remove();
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    const task = await this.getTaskById(id);

    task.status = status;
    await task.save();

    return task;
  }
}
