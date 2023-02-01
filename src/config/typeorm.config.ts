import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME,
  port: (process.env.RDS_PORT && parseInt(process.env.RDS_PORT)) || 5432,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.js'],
};
