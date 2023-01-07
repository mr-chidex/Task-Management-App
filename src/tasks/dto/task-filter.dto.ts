import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
