import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: TaskFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    }
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDTO) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTask(@Param('id') taskId: string) {
    return this.tasksService.geTask(taskId);
  }

  @Delete(':id')
  deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Body('status') status: TaskStatus,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }
}
