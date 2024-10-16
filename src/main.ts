/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  config  from 'config';
import { TransformationInterceptor } from './responseInterception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformationInterceptor());
  await app.listen(config.get('port'), () => {
    console.log(`Server running on port ${config.get('port')}`); 
  });
}
bootstrap();
