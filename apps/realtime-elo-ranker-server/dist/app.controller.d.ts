import { MessageEvent } from '@nestjs/common';
import { AppService } from './app.service';
import { EventGateway } from './event.gateway';
import { Observable } from 'rxjs';
export declare class AppController {
    private readonly appService;
    private readonly eventGateway;
    constructor(appService: AppService, eventGateway: EventGateway);
    postMatchResult(winner: string, loser: string, draw: boolean): void;
    getRanking(): {
        id: string;
        rank: number;
    }[];
    createPlayer(id: string): void;
    sendRankingUpdates(): Observable<MessageEvent>;
}
