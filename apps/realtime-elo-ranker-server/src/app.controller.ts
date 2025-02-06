// filepath: /home/iut45/Etudiants/o22201673/Documents/DeveloppementAvance/TP/realtime-elo-ranker/apps/realtime-elo-ranker-server/src/app.controller.ts
import { Controller, Post, Get, Body, Sse, MessageEvent } from '@nestjs/common';
import { AppService } from './app.service';
import { EventGateway } from './event.gateway';
import { Observable } from 'rxjs';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventGateway: EventGateway,
  ) {}

  @Post('match')
  postMatchResult(
    @Body('winner') winner: string,
    @Body('loser') loser: string,
    @Body('draw') draw: boolean,
  ): void {
    this.appService.calculateMatchResult(winner, loser, draw);
  }

  @Get('ranking')
  async getRanking(): Promise<{ id: string, rank: number }[]> {
    return await this.appService.getRanking();
  }

  @Post('player')
  createPlayer(@Body('id') id: string): void {
    this.appService.createPlayer(id);
  }

  @Sse('ranking/events')
  sendRankingUpdates(): Observable<MessageEvent> {
    return this.eventGateway.onRankingUpdate();
  }
}