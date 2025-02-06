// filepath: /home/iut45/Etudiants/o22201673/Documents/DeveloppementAvance/TP/realtime-elo-ranker/apps/realtime-elo-ranker-server/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitter2 } from 'eventemitter2';
import { EventGateway } from './event.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    EventGateway,
    {
      provide: 'EventEmitter2',
      useClass: EventEmitter2,
    },
  ],
})
export class AppModule {}