import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPaload } from './interface/jwt.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { Repository } from 'typeorm';
import * as config from 'config';
import { JWT } from 'src/config/config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (config.get('jwt') as JWT).secret,
    });
  }

  async validate(payload: JWTPaload) {
    const { username } = payload;

    const user = this.userRepository.findOneBy({ username });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
