import { EventEmitter2 } from 'eventemitter2';
import { Observable } from 'rxjs';
export declare class EventGateway {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emitRankingUpdate(update: any): void;
    onRankingUpdate(): Observable<any>;
    emitMatchFinished(update: any): void;
    onMatchFinished(): Observable<any>;
}
