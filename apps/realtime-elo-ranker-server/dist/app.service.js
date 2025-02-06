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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("./player.entity");
const eventemitter2_1 = require("eventemitter2");
const event_gateway_1 = require("./event.gateway");
let AppService = class AppService {
    constructor(playerRepository, eventEmitter, eventGateway) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
        this.eventGateway = eventGateway;
    }
    async calculateMatchResult(winnerId, loserId, draw) {
        let winner = await this.createPlayer(winnerId);
        let loser = await this.createPlayer(loserId);
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
        await this.playerRepository.save([winner, loser]);
        const rankingUpdate = await this.getRanking();
        this.eventEmitter.emit('ranking.update', rankingUpdate);
        this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });
    }
    async getRanking() {
        const players = await this.playerRepository.find();
        return players.map(player => ({ id: player.id, rank: player.rank }));
    }
    async createPlayer(id) {
        let player = await this.playerRepository.findOne({ where: { id } });
        if (!player) {
            player = new player_entity_1.Player();
            player.id = id;
            player.rank = 1000;
            await this.playerRepository.save(player);
            this.eventEmitter.emit('player.created', player);
            const rankingUpdate = await this.getRanking();
            this.eventGateway.emitRankingUpdate({ updatedPlayers: rankingUpdate });
        }
        return player;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, common_1.Inject)('EventEmitter2')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        eventemitter2_1.EventEmitter2,
        event_gateway_1.EventGateway])
], AppService);
//# sourceMappingURL=app.service.js.map