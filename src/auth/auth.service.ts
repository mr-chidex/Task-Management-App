import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import * as bcrypt from 'bcrypt';

import { User } from '../database/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentials: RegisterAuthDto) {
    const { username, password } = authCredentials;

    const userExist = await this.userRepository.findOneBy({ username });
    if (userExist) throw new BadRequestException('username already in use');

    const salt = await bcrypt.genSalt(12);
    const hashPass = await bcrypt.hash(password, salt);

    await this.userRepository.create({ username, password: hashPass }).save();
  }

  async signin(loginCredentials: LoginAuthDto) {
    const user = await this.validateCredentials(loginCredentials);

    const payload = { username: user.username };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateCredentials(loginCredentials: LoginAuthDto) {
    const { username, password } = loginCredentials;

    const user = await this.userRepository.findOneBy({ username });
    if (!user)
      throw new UnauthorizedException('username or password is incorrect');

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      throw new UnauthorizedException('username or password is incorrect');

    return user;
  }
}
