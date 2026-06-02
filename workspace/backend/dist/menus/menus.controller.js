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
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const menus_service_1 = require("./menus.service");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const user_entity_1 = require("../entities/user.entity");
let MenusController = class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }
    async create(body, user) {
        return await this.menusService.create(body, user.tenantId, user.businessId);
    }
    async findAll(outletId, user) {
        return await this.menusService.findAll(user.tenantId, outletId);
    }
    async findOne(id, user) {
        return await this.menusService.findOne(id, user.tenantId);
    }
    async getMenuWithItems(id, include, user) {
        const includeCategories = include?.includes('categories');
        const includeItems = include?.includes('items');
        return await this.menusService.getMenuWithItems(id, user.tenantId, includeCategories, includeItems);
    }
    async update(id, body, user) {
        return await this.menusService.update(id, body, user.tenantId);
    }
    async remove(id, user) {
        await this.menusService.remove(id, user.tenantId);
        return { message: 'Menu deleted successfully' };
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Query)('outletId')),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('include')),
    __param(2, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "getMenuWithItems", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map