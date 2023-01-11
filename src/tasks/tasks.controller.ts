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
import { Task, TaskStatus } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterDto: TaskFilterDto,
  ): Promise<Task[]> {
    return this.tasksService.getAll(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDTO) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) taskId: number): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) taskId: number): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Body('status', TaskStatusPipe) status: TaskStatus,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
