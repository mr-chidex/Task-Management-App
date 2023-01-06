import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks() {
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
}
