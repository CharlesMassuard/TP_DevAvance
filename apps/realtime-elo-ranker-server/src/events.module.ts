import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitter2 } from 'eventemitter2';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'EventEmitter2',
      useClass: EventEmitter2,
    },
  ],
})
export class AppModule {}