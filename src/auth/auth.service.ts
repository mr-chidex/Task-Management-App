import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';

import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(authCredentials: AuthCredentialDto) {
    const { username, password } = authCredentials;

    const userExist = await this.userRepository.findOneBy({ username });
    if (userExist) throw new BadRequestException('username already in use');

    await this.userRepository.create({ username, password }).save();
  }
}
