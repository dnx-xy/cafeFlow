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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_entity_1 = require("../entities/business.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const staff_entity_1 = require("../entities/staff.entity");
const menu_entity_1 = require("../entities/menu.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const plan_config_1 = require("./plan.config");
let PlansService = class PlansService {
    constructor(businessesRepository, outletsRepository, staffRepository, menusRepository, menuItemsRepository) {
        this.businessesRepository = businessesRepository;
        this.outletsRepository = outletsRepository;
        this.staffRepository = staffRepository;
        this.menusRepository = menusRepository;
        this.menuItemsRepository = menuItemsRepository;
    }
    async getPlan(businessId) {
        const business = await this.businessesRepository.findOne({
            where: { id: businessId },
            select: { plan: true, subscriptionStatus: true, trialEndsAt: true },
        });
        if (!business)
            return plan_config_1.Plan.FREE;
        const status = business.subscriptionStatus;
        const now = new Date();
        const trialEnd = business.trialEndsAt;
        if (status === 'inactive' || status === 'canceled')
            return plan_config_1.Plan.FREE;
        if (status === 'trial' && trialEnd && trialEnd < now)
            return plan_config_1.Plan.FREE;
        if (status === 'past_due')
            return plan_config_1.Plan.FREE;
        return business?.plan || plan_config_1.Plan.FREE;
    }
    async getLimits(businessId) {
        const plan = await this.getPlan(businessId);
        return { plan, limits: plan_config_1.PLAN_LIMITS[plan] };
    }
    async enforceOutletLimit(businessId) {
        const { plan, limits } = await this.getLimits(businessId);
        if (limits.maxOutlets === -1)
            return;
        const count = await this.outletsRepository.count({ where: { businessId } });
        if (count >= limits.maxOutlets) {
            throw new common_1.ForbiddenException(`Plan ${plan} limit reached: max ${limits.maxOutlets} outlets. Upgrade your plan.`);
        }
    }
    async enforceStaffLimit(businessId) {
        const { plan, limits } = await this.getLimits(businessId);
        if (limits.maxStaff === -1)
            return;
        const count = await this.staffRepository.count({ where: { tenantId: businessId } });
        if (count >= limits.maxStaff) {
            throw new common_1.ForbiddenException(`Plan ${plan} limit reached: max ${limits.maxStaff} staff members. Upgrade your plan.`);
        }
    }
    async enforceMenuLimit(businessId) {
        const { plan, limits } = await this.getLimits(businessId);
        if (limits.maxMenus === -1)
            return;
        const count = await this.menusRepository.count({ where: { businessId } });
        if (count >= limits.maxMenus) {
            throw new common_1.ForbiddenException(`Plan ${plan} limit reached: max ${limits.maxMenus} menus. Upgrade your plan.`);
        }
    }
    async enforceMenuItemLimit(businessId, menuId) {
        const { plan, limits } = await this.getLimits(businessId);
        if (limits.maxMenuItems === -1)
            return;
        const where = {};
        if (menuId) {
            where.menuId = menuId;
        }
        else {
            const menus = await this.menusRepository.find({ where: { businessId }, select: { id: true } });
            where.menuId = menus.length > 0 ? menus.map(m => m.id) : 'none';
        }
        const count = await this.menuItemsRepository.count({ where });
        if (count >= limits.maxMenuItems) {
            throw new common_1.ForbiddenException(`Plan ${plan} limit reached: max ${limits.maxMenuItems} menu items. Upgrade your plan.`);
        }
    }
    async getFeatureAccess(businessId, feature) {
        const { limits } = await this.getLimits(businessId);
        return limits[feature];
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __param(1, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __param(2, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(3, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(4, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlansService);
//# sourceMappingURL=plans.service.js.map