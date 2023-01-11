import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { TaskStatus } from '../../database/tasks.entity';

@Injectable()
export class TaskStatusPipe implements PipeTransform {
  readonly validStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any, _metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is an invalid status type`);
    }

    return value;
  }

  private isValidStatus(value: any) {
    const index = this.validStatus.indexOf(value);

    return index !== -1;
  }
}
