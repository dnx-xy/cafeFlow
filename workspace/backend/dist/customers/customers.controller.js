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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const user_entity_1 = require("../entities/user.entity");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(body, user) {
        return await this.customersService.create(body, user.tenantId);
    }
    async findAll(user) {
        const data = await this.customersService.findAll(user.tenantId);
        return { data, pagination: { total: data.length, page: 1, limit: data.length } };
    }
    async getProfile(user) {
        return await this.customersService.getCustomerProfile(user.id, user.tenantId);
    }
    async findOne(id, user) {
        return await this.customersService.findOne(id, user.tenantId);
    }
    async updateProfile(body, user) {
        return await this.customersService.update(user.id, body, user.tenantId);
    }
    async update(id, body, user) {
        return await this.customersService.update(id, body, user.tenantId);
    }
    async remove(id, user) {
        await this.customersService.remove(id, user.tenantId);
        return { message: 'Customer deleted successfully' };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map