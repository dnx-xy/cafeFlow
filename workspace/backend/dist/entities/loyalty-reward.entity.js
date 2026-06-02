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
exports.LoyaltyReward = exports.RewardType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const loyalty_program_entity_1 = require("./loyalty-program.entity");
var RewardType;
(function (RewardType) {
    RewardType["DISCOUNT"] = "DISCOUNT";
    RewardType["FREE_ITEM"] = "FREE_ITEM";
    RewardType["VOUCHER"] = "VOUCHER";
    RewardType["EXCLUSIVE_ACCESS"] = "EXCLUSIVE_ACCESS";
})(RewardType || (exports.RewardType = RewardType = {}));
let LoyaltyReward = class LoyaltyReward extends base_entity_1.BaseEntity {
};
exports.LoyaltyReward = LoyaltyReward;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LoyaltyReward.prototype, "pointsRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RewardType }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "rewardType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyReward.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "freeItemMenuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LoyaltyReward.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "loyaltyProgramId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyReward.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loyalty_program_entity_1.LoyaltyProgram, (program) => program.loyaltyRewards),
    __metadata("design:type", loyalty_program_entity_1.LoyaltyProgram)
], LoyaltyReward.prototype, "loyaltyProgram", void 0);
exports.LoyaltyReward = LoyaltyReward = __decorate([
    (0, typeorm_1.Entity)('loyalty_rewards')
], LoyaltyReward);
//# sourceMappingURL=loyalty-reward.entity.js.map