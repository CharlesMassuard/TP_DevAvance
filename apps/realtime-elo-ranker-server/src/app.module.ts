import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitter2 } from 'eventemitter2';
import { Player } from './player.entity';
import { EventGateway } from './event.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/db.sqlite',
      entities: [Player],
      synchronize: true,  // Crée la table si elle n'existe pas
    }),
    TypeOrmModule.forFeature([Player]),
  ],
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
