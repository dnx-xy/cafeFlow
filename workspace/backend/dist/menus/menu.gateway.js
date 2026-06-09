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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let MenuGateway = class MenuGateway {
    handleConnection(client) {
        const businessId = client.handshake.query.businessId;
        if (businessId) {
            client.join(`business:${businessId}`);
        }
    }
    handleDisconnect(client) {
        const businessId = client.handshake.query.businessId;
        if (businessId) {
            client.leave(`business:${businessId}`);
        }
    }
    handleSubscribe(client, businessId) {
        client.join(`business:${businessId}`);
    }
    handleUnsubscribe(client, businessId) {
        client.leave(`business:${businessId}`);
    }
    emitMenuItemUpdated(businessId, data) {
        this.server.to(`business:${businessId}`).emit('menuItem:updated', data);
    }
};
exports.MenuGateway = MenuGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MenuGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MenuGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MenuGateway.prototype, "handleUnsubscribe", null);
exports.MenuGateway = MenuGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/menu-updates',
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.101.2:3000'],
            credentials: true,
        },
    })
], MenuGateway);
//# sourceMappingURL=menu.gateway.js.map