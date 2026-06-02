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
exports.PointTransaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const customer_entity_1 = require("./customer.entity");
const loyalty_program_entity_1 = require("./loyalty-program.entity");
const order_entity_1 = require("./order.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["EARNED"] = "EARNED";
    TransactionType["SPENT"] = "SPENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let PointTransaction = class PointTransaction extends base_entity_1.BaseEntity {
};
exports.PointTransaction = PointTransaction;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], PointTransaction.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], PointTransaction.prototype, "loyaltyProgramId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PointTransaction.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionType }),
    __metadata("design:type", String)
], PointTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PointTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PointTransaction.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PointTransaction.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], PointTransaction.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.loyaltyPoints),
    __metadata("design:type", customer_entity_1.Customer)
], PointTransaction.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loyalty_program_entity_1.LoyaltyProgram, (program) => program.pointsTransactions),
    __metadata("design:type", loyalty_program_entity_1.LoyaltyProgram)
], PointTransaction.prototype, "loyaltyProgram", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.pointTransactions),
    __metadata("design:type", order_entity_1.Order)
], PointTransaction.prototype, "order", void 0);
exports.PointTransaction = PointTransaction = __decorate([
    (0, typeorm_1.Entity)('point_transactions')
], PointTransaction);
//# sourceMappingURL=point-transaction.entity.js.map