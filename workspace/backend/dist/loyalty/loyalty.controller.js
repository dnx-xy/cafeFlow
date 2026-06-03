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
exports.LoyaltyController = void 0;
const common_1 = require("@nestjs/common");
const loyalty_service_1 = require("./loyalty.service");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const user_entity_1 = require("../entities/user.entity");
let LoyaltyController = class LoyaltyController {
    constructor(loyaltyService) {
        this.loyaltyService = loyaltyService;
    }
    async getLoyaltyProgram(user) {
        return await this.loyaltyService.getLoyaltyProgram(user.tenantId, user.businessId);
    }
    async createPointsTransaction(body, user) {
        return await this.loyaltyService.createPointsTransaction(body, user.tenantId);
    }
    async getCustomerPoints(customerId, user) {
        return {
            points: await this.loyaltyService.getCustomerPoints(user.tenantId, customerId),
        };
    }
};
exports.LoyaltyController = LoyaltyController;
__decorate([
    (0, common_1.Get)('programs'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getLoyaltyProgram", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "createPointsTransaction", null);
__decorate([
    (0, common_1.Get)('points/:customerId'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getCustomerPoints", null);
exports.LoyaltyController = LoyaltyController = __decorate([
    (0, common_1.Controller)('loyalty'),
    __metadata("design:paramtypes", [loyalty_service_1.LoyaltyService])
], LoyaltyController);
//# sourceMappingURL=loyalty.controller.js.map