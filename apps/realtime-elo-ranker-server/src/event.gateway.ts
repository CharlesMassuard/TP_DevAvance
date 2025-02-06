// filepath: /home/iut45/Etudiants/o22201673/Documents/DeveloppementAvance/TP/realtime-elo-ranker/apps/realtime-elo-ranker-server/src/event.gateway.ts
import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Observable, fromEvent } from 'rxjs';

@Injectable()
export class EventGateway {
  constructor(@Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2) {}

  emitRankingUpdate(update: any) {
    console.log("🔥 Émission d'une mise à jour du classement :", update);

    if (update.updatedPlayers && Array.isArray(update.updatedPlayers)) {
      update.updatedPlayers.forEach((player: { id: any; rank: any; }) => {
        this.eventEmitter.emit('rankingUpdate', {
          type: 'RankingUpdate',
          player: { id: player.id, rank: player.rank }
        });
      });
      return;
    }

    if (update.player) {
      this.eventEmitter.emit('rankingUpdate', update);
      return;
    }

    console.error("❌ Erreur : Format d'événement rankingUpdate invalide :", update);
  }

  onRankingUpdate(): Observable<any> {
    console.log("📡 Un client SSE s'est connecté aux mises à jour du classement.");
    return new Observable(observer => {
      const handler = (update: any) => {
        observer.next({
          data: JSON.stringify(update),
        });
      };
  
      this.eventEmitter.on('rankingUpdate', handler);
  
      return () => {
        this.eventEmitter.off('rankingUpdate', handler);
      };
    });
  }

  emitMatchFinished(update: any) {
    console.log("⚡ Émission d'une mise à jour de match terminé :", update);
    this.eventEmitter.emit('matchFinished', update);
  }

  onMatchFinished(): Observable<any> {
    return fromEvent(this.eventEmitter, 'matchFinished');
  }
}