import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // make sure username is saved as lowercase
    if (value.username) {
      value.username = value.username?.toLowerCase();
    }

    return value;
  }
}
