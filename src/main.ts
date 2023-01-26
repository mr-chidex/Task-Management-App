import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const PORT = 3000;

  await app.listen(PORT);
  logger.log(`Application running on PORT::>> ${PORT}`);
}
bootstrap();
