// filepath: /home/iut45/Etudiants/o22201673/Documents/DeveloppementAvance/TP/realtime-elo-ranker/apps/realtime-elo-ranker-server/src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { EventGateway } from './event.gateway';

@Injectable()
export class AppService {
  private players: { [key: string]: { rank: number } } = {};

  constructor(
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2,
    private readonly eventGateway: EventGateway,
  ) {}

  calculateMatchResult(winnerId: string, loserId: string, draw: boolean): void {
    this.createPlayer(winnerId);
    this.createPlayer(loserId);

    const winner = this.players[winnerId];
    const loser = this.players[loserId];

    const expectedWinnerRank = 1 / (1 + 10 ** ((loser.rank - winner.rank) / 400));
    const expectedLoserRank = 1 / (1 + 10 ** ((winner.rank - loser.rank) / 400));

    const k = 32; // Elo K-factor
    if (draw) {
      winner.rank += k * (0.5 - expectedWinnerRank);
      loser.rank += k * (0.5 - expectedLoserRank);
    } else {
      winner.rank += k * (1 - expectedWinnerRank);
      loser.rank += k * (0 - expectedLoserRank);
    }

    const rankingUpdate = this.getRanking();
    this.eventEmitter.emit('ranking.update', rankingUpdate);
    this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });
  }

  getRanking(): { id: string, rank: number }[] {
    return Object.entries(this.players).map(([id, { rank }]) => ({ id, rank }));
  }

  createPlayer(id: string): void {
    if (!this.players[id]) {
      this.players[id] = { rank: 1000 }; // Initial rank
      const player = { id, rank: 1000 };
      
      this.eventEmitter.emit('player.created', player);
      this.eventGateway.emitRankingUpdate({ updatedPlayers: this.getRanking() }); // 🔥 Ajout d'une mise à jour complète
    }
  }
  
}