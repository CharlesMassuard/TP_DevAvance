"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const eventemitter2_1 = require("eventemitter2");
const event_gateway_1 = require("./event.gateway");
let AppService = class AppService {
    constructor(eventEmitter, eventGateway) {
        this.eventEmitter = eventEmitter;
        this.eventGateway = eventGateway;
        this.players = {};
    }
    calculateMatchResult(winnerId, loserId, draw) {
        this.createPlayer(winnerId);
        this.createPlayer(loserId);
        const winner = this.players[winnerId];
        const loser = this.players[loserId];
        const expectedWinnerRank = 1 / (1 + 10 ** ((loser.rank - winner.rank) / 400));
        const expectedLoserRank = 1 / (1 + 10 ** ((winner.rank - loser.rank) / 400));
        const k = 32;
        if (draw) {
            winner.rank += k * (0.5 - expectedWinnerRank);
            loser.rank += k * (0.5 - expectedLoserRank);
        }
        else {
            winner.rank += k * (1 - expectedWinnerRank);
            loser.rank += k * (0 - expectedLoserRank);
        }
        const rankingUpdate = this.getRanking();
        this.eventEmitter.emit('ranking.update', rankingUpdate);
        this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });
    }
    getRanking() {
        return Object.entries(this.players).map(([id, { rank }]) => ({ id, rank }));
    }
    createPlayer(id) {
        if (!this.players[id]) {
            this.players[id] = { rank: 1000 };
            const player = { id, rank: 1000 };
            this.eventEmitter.emit('player.created', player);
            this.eventGateway.emitRankingUpdate({ updatedPlayers: this.getRanking() });
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('EventEmitter2')),
    __metadata("design:paramtypes", [eventemitter2_1.EventEmitter2,
        event_gateway_1.EventGateway])
], AppService);
//# sourceMappingURL=app.service.js.map