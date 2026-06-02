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
exports.LoyaltyTierRule = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const loyalty_program_entity_1 = require("./loyalty-program.entity");
let LoyaltyTierRule = class LoyaltyTierRule extends base_entity_1.BaseEntity {
};
exports.LoyaltyTierRule = LoyaltyTierRule;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyTierRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoyaltyTierRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LoyaltyTierRule.prototype, "minPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyTierRule.prototype, "maxPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LoyaltyTierRule.prototype, "tierLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], LoyaltyTierRule.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyTierRule.prototype, "loyaltyProgramId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], LoyaltyTierRule.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => loyalty_program_entity_1.LoyaltyProgram, (program) => program.loyaltyTierRules),
    __metadata("design:type", loyalty_program_entity_1.LoyaltyProgram)
], LoyaltyTierRule.prototype, "loyaltyProgram", void 0);
exports.LoyaltyTierRule = LoyaltyTierRule = __decorate([
    (0, typeorm_1.Entity)('loyalty_tier_rules')
], LoyaltyTierRule);
//# sourceMappingURL=loyalty-tier-rule.entity.js.map