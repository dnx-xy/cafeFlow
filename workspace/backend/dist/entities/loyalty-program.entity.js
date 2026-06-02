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
exports.LoyaltyProgram = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const business_entity_1 = require("./business.entity");
const point_transaction_entity_1 = require("./point-transaction.entity");
const loyalty_reward_entity_1 = require("./loyalty-reward.entity");
const loyalty_tier_rule_entity_1 = require("./loyalty-tier-rule.entity");
let LoyaltyProgram = class LoyaltyProgram extends base_entity_1.BaseEntity {
};
exports.LoyaltyProgram = LoyaltyProgram;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 1 }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "pointsPerRupiah", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "minimumPurchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyProgram.prototype, "maximumPointsPerOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LoyaltyProgram.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyProgram.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.loyaltyPrograms),
    __metadata("design:type", business_entity_1.Business)
], LoyaltyProgram.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => point_transaction_entity_1.PointTransaction, (transaction) => transaction.loyaltyProgram),
    __metadata("design:type", Array)
], LoyaltyProgram.prototype, "pointsTransactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loyalty_reward_entity_1.LoyaltyReward, (reward) => reward.loyaltyProgram),
    __metadata("design:type", Array)
], LoyaltyProgram.prototype, "loyaltyRewards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loyalty_tier_rule_entity_1.LoyaltyTierRule, (rule) => rule.loyaltyProgram),
    __metadata("design:type", Array)
], LoyaltyProgram.prototype, "loyaltyTierRules", void 0);
exports.LoyaltyProgram = LoyaltyProgram = __decorate([
    (0, typeorm_1.Entity)('loyalty_programs')
], LoyaltyProgram);
//# sourceMappingURL=loyalty-program.entity.js.map