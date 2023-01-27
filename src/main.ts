import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const PORT =
    process.env.PORT || (config.get('server') as { PORT: number }).PORT;

  await app.listen(PORT);
  logger.log(`Application running on PORT::>> ${PORT}`);
}
bootstrap();
