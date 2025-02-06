import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { EventGateway } from './event.gateway';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @Inject('EventEmitter2') private readonly eventEmitter: EventEmitter2,
    private readonly eventGateway: EventGateway,
  ) {}

  async calculateMatchResult(winnerId: string, loserId: string, draw: boolean): Promise<void> {
    let winner = await this.createPlayer(winnerId);
    let loser = await this.createPlayer(loserId);

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

    await this.playerRepository.save([winner, loser]);

    const rankingUpdate = await this.getRanking();
    this.eventEmitter.emit('ranking.update', rankingUpdate);
    this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });
  }

  async getRanking(): Promise<{ id: string, rank: number }[]> {
    const players = await this.playerRepository.find();
    return players.map(player => ({ id: player.id, rank: player.rank }));
  }

  async createPlayer(id: string): Promise<Player> {
    let player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      player = new Player();
      player.id = id;
      player.rank = 1000; // Rank initial
      await this.playerRepository.save(player);
      this.eventEmitter.emit('player.created', player);
      const rankingUpdate = await this.getRanking();
      this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });

    }
    return player;
  }
}
