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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const event_gateway_1 = require("./event.gateway");
const rxjs_1 = require("rxjs");
let AppController = class AppController {
    constructor(appService, eventGateway) {
        this.appService = appService;
        this.eventGateway = eventGateway;
    }
    postMatchResult(winner, loser, draw) {
        this.appService.calculateMatchResult(winner, loser, draw);
    }
    async getRanking() {
        return await this.appService.getRanking();
    }
    createPlayer(id) {
        this.appService.createPlayer(id);
    }
    sendRankingUpdates() {
        return this.eventGateway.onRankingUpdate();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('match'),
    __param(0, (0, common_1.Body)('winner')),
    __param(1, (0, common_1.Body)('loser')),
    __param(2, (0, common_1.Body)('draw')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "postMatchResult", null);
__decorate([
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Post)('player'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Sse)('ranking/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "sendRankingUpdates", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        event_gateway_1.EventGateway])
], AppController);
//# sourceMappingURL=app.controller.js.map