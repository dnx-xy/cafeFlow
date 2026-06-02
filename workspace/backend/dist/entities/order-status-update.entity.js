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
exports.OrderStatusUpdate = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const order_entity_1 = require("./order.entity");
const enums_1 = require("./enums");
let OrderStatusUpdate = class OrderStatusUpdate extends base_entity_1.BaseEntity {
};
exports.OrderStatusUpdate = OrderStatusUpdate;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderStatusUpdate.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.OrderStatus }),
    __metadata("design:type", String)
], OrderStatusUpdate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrderStatusUpdate.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderStatusUpdate.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.orderStatusUpdates),
    __metadata("design:type", order_entity_1.Order)
], OrderStatusUpdate.prototype, "order", void 0);
exports.OrderStatusUpdate = OrderStatusUpdate = __decorate([
    (0, typeorm_1.Entity)('order_status_updates')
], OrderStatusUpdate);
//# sourceMappingURL=order-status-update.entity.js.map