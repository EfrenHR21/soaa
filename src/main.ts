/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
import cookieParser from 'cookie-parser';
import { raw } from 'express';
import { TransformationInterceptor } from './common/responseInterception';




async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(cookieParser());

  app.use('/api/v1/orders/webhook', raw({ type: '*/*' }));


  app.setGlobalPrefix(config.get('appPrefix'));
  app.useGlobalInterceptors(new TransformationInterceptor());
  await app.listen(config.get('port'), () => {
    return console.log(`Server is running on port ${config.get('port')}`);
  });
}
bootstrap();
