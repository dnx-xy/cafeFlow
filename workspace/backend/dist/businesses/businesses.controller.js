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
exports.BusinessesController = void 0;
const common_1 = require("@nestjs/common");
const businesses_service_1 = require("./businesses.service");
const create_business_dto_1 = require("./dto/create-business.dto");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const user_entity_1 = require("../entities/user.entity");
let BusinessesController = class BusinessesController {
    constructor(businessesService) {
        this.businessesService = businessesService;
    }
    async create(createBusinessDto, user) {
        return await this.businessesService.create(createBusinessDto, user.tenantId, user.id);
    }
    async findAll(user) {
        return await this.businessesService.findAll(user.tenantId);
    }
    async findOne(id, user) {
        return await this.businessesService.findOne(id, user.tenantId);
    }
    async update(id, updateBusinessDto, user) {
        return await this.businessesService.update(id, updateBusinessDto, user.tenantId);
    }
    async remove(id, user) {
        await this.businessesService.remove(id, user.tenantId);
        return { message: 'Business deleted successfully' };
    }
};
exports.BusinessesController = BusinessesController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_dto_1.CreateBusinessDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "remove", null);
exports.BusinessesController = BusinessesController = __decorate([
    (0, common_1.Controller)('businesses'),
    __metadata("design:paramtypes", [businesses_service_1.BusinessesService])
], BusinessesController);
//# sourceMappingURL=businesses.controller.js.map