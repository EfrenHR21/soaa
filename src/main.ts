/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
/* import  config  from 'config'; */
import { Logger } from '@nestjs/common';
import { TransformationInterceptor } from './common/responseInterception';
import { envs } from 'config/env';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('UserService-Gateway');

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix(envs.appPrefix )
  app.useGlobalInterceptors(new TransformationInterceptor());
  await app.listen(envs.port);

  logger.log(`Application listening on port ${envs.port}`);
}
bootstrap();