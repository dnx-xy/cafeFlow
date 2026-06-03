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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_decorators_1 = require("./decorators/auth.decorators");
const user_entity_1 = require("../entities/user.entity");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return await this.authService.login(user);
    }
    async getProfile(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            businessId: user.businessId,
        };
    }
    async register(registerDto) {
        const user = await this.authService.register(registerDto);
        return await this.authService.login(user);
    }
    async refreshToken(refreshTokenDto, user) {
        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            tenantId: user.tenantId,
            businessId: user.businessId,
            role: user.role,
        };
        return {
            access_token: this.authService.signToken(payload),
            expires_in: 3600,
        };
    }
    async logout(user) {
        return { message: 'Successfully logged out' };
    }
    async switchTenant(body, currentUser) {
        const tenant = await this.authService.findTenantById(body.tenantId);
        if (!tenant) {
            throw new Error('Tenant not found');
        }
        const business = await this.authService.findBusinessByTenantId(body.tenantId);
        if (!business) {
            throw new Error('Business not found for this tenant');
        }
        const payload = {
            email: currentUser.email,
            id: currentUser.id,
            name: currentUser.name,
            tenantId: body.tenantId,
            businessId: business.id,
            role: currentUser.role,
        };
        const access_token = this.authService.signToken(payload);
        const refresh_token = this.authService.signToken(payload, '7d');
        return {
            access_token,
            refresh_token,
            expires_in: 3600,
            user: {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                tenantId: body.tenantId,
                businessId: business.id,
            }
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, auth_decorators_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, auth_decorators_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TENANT_OWNER, user_entity_1.UserRole.MANAGER, user_entity_1.UserRole.STAFF, user_entity_1.UserRole.CUSTOMER),
    __param(0, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('switch-tenant'),
    (0, auth_decorators_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_decorators_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchTenant", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map