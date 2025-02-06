import { EventEmitter2 } from 'eventemitter2';
import { EventGateway } from './event.gateway';
export declare class AppService {
    private readonly eventEmitter;
    private readonly eventGateway;
    private players;
    constructor(eventEmitter: EventEmitter2, eventGateway: EventGateway);
    calculateMatchResult(winnerId: string, loserId: string, draw: boolean): void;
    getRanking(): {
        id: string;
        rank: number;
    }[];
    createPlayer(id: string): void;
}
