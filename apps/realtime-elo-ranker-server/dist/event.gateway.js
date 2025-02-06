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
exports.EventGateway = void 0;
const common_1 = require("@nestjs/common");
const eventemitter2_1 = require("eventemitter2");
const rxjs_1 = require("rxjs");
let EventGateway = class EventGateway {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    emitRankingUpdate(update) {
        console.log("🔥 Émission d'une mise à jour du classement :", update);
        if (update.updatedPlayers && Array.isArray(update.updatedPlayers)) {
            update.updatedPlayers.forEach((player) => {
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
    onRankingUpdate() {
        console.log("📡 Un client SSE s'est connecté aux mises à jour du classement.");
        return new rxjs_1.Observable(observer => {
            const handler = (update) => {
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
    emitMatchFinished(update) {
        console.log("⚡ Émission d'une mise à jour de match terminé :", update);
        this.eventEmitter.emit('matchFinished', update);
    }
    onMatchFinished() {
        return (0, rxjs_1.fromEvent)(this.eventEmitter, 'matchFinished');
    }
};
exports.EventGateway = EventGateway;
exports.EventGateway = EventGateway = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('EventEmitter2')),
    __metadata("design:paramtypes", [eventemitter2_1.EventEmitter2])
], EventGateway);
//# sourceMappingURL=event.gateway.js.map