import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { DB } from './config.interface';

const dbConfig: DB = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dbConfig,
  entities: [__dirname + '/../**/*.entity.js'],
};
