import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskStatusPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from '../database/tasks.entity';
import { TasksService } from './tasks.service';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../database/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterDto: TaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getAll(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get(':id')
  getTask(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(taskId, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Body('status', TaskStatusPipe) status: TaskStatus,
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }
}
