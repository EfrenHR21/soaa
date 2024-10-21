/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
/* import config from 'config'; */
import { AllExceptionFilter } from './common/httpExceptionFilter';
import { UsersModule } from './users/users.module';
import { envs } from 'config/env';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongodbUrl,{
      //useNewUrlParser : true,
      //useUnifiedTopology: true,
      w: 1,
      //keepAlive: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide : 'APP_FILTER',
      useClass: AllExceptionFilter,
    }
  ],
})
export class AppModule {}
