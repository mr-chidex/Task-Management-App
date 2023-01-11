import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../../database/tasks.entity';

export class TaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
