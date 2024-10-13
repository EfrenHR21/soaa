/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongodbUrl'),{
      //useNewUrlParser : true,
      //useUnifiedTopology: true,
      w: 1,
      //keepAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
