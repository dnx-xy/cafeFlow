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
exports.CustomerFeedback = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const customer_entity_1 = require("./customer.entity");
const order_entity_1 = require("./order.entity");
let CustomerFeedback = class CustomerFeedback extends base_entity_1.BaseEntity {
};
exports.CustomerFeedback = CustomerFeedback;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerFeedback.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerFeedback.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CustomerFeedback.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerFeedback.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerFeedback.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.customerFeedback),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerFeedback.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.customerFeedback),
    __metadata("design:type", order_entity_1.Order)
], CustomerFeedback.prototype, "order", void 0);
exports.CustomerFeedback = CustomerFeedback = __decorate([
    (0, typeorm_1.Entity)('customer_feedback')
], CustomerFeedback);
//# sourceMappingURL=customer-feedback.entity.js.map