import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { EventEmitter2 } from 'eventemitter2';
import { EventGateway } from './event.gateway';
export declare class AppService {
    private playerRepository;
    private readonly eventEmitter;
    private readonly eventGateway;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2, eventGateway: EventGateway);
    calculateMatchResult(winnerId: string, loserId: string, draw: boolean): Promise<void>;
    getRanking(): Promise<{
        id: string;
        rank: number;
    }[]>;
    createPlayer(id: string): Promise<Player>;
}
