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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("../entities/menu.entity");
const menu_category_entity_1 = require("../entities/menu-category.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const menu_gateway_1 = require("./menu.gateway");
const plans_service_1 = require("../plans/plans.service");
let MenusService = class MenusService {
    constructor(menusRepository, menuCategoriesRepository, menuItemsRepository, outletsRepository, menuGateway, plansService) {
        this.menusRepository = menusRepository;
        this.menuCategoriesRepository = menuCategoriesRepository;
        this.menuItemsRepository = menuItemsRepository;
        this.outletsRepository = outletsRepository;
        this.menuGateway = menuGateway;
        this.plansService = plansService;
    }
    async create(menuData, tenantId, outletId, businessId) {
        await this.plansService.enforceMenuLimit(businessId);
        if (!outletId) {
            let outlet = await this.outletsRepository.findOne({ where: { businessId }, order: { createdAt: 'ASC' } });
            if (!outlet) {
                outlet = this.outletsRepository.create({
                    name: 'Main Outlet',
                    businessId,
                    tenantId,
                });
                outlet = await this.outletsRepository.save(outlet);
            }
            outletId = outlet.id;
        }
        const menu = this.menusRepository.create({
            ...menuData,
            tenantId,
            outletId,
            businessId,
        });
        return await this.menusRepository.save(menu);
    }
    async findAll(tenantId, outletId) {
        const where = { tenantId };
        if (outletId) {
            where.outletId = outletId;
        }
        return await this.menusRepository.find({ where });
    }
    async findOne(id, tenantId) {
        return await this.menusRepository.findOne({
            where: { id, tenantId },
            relations: { categories: true, menuGroups: true, promotions: true },
        });
    }
    async update(id, updateMenuDto, tenantId) {
        await this.menusRepository.update({ id, tenantId }, updateMenuDto);
        return await this.findOne(id, tenantId);
    }
    async remove(id, tenantId) {
        await this.menusRepository.delete({ id, tenantId });
    }
    async getMenuWithItems(id, tenantId, includeCategories = false, includeItems = false) {
        const options = {
            where: { id, tenantId },
        };
        if (includeCategories || includeItems) {
            options.relations = {};
            if (includeCategories) {
                options.relations.categories = true;
            }
            if (includeItems) {
                options.relations['categories.menuItems'] = true;
            }
        }
        return await this.menusRepository.findOne(options);
    }
    async createCategory(menuId, data, tenantId) {
        const category = this.menuCategoriesRepository.create({
            ...data,
            menuId,
            tenantId,
        });
        return await this.menuCategoriesRepository.save(category);
    }
    async updateCategory(id, data, tenantId) {
        await this.menuCategoriesRepository.update({ id, tenantId }, data);
        return await this.menuCategoriesRepository.findOne({ where: { id, tenantId } });
    }
    async removeCategory(id, tenantId) {
        await this.menuCategoriesRepository.delete({ id, tenantId });
    }
    async createItem(menuId, data, tenantId, businessId) {
        if (businessId) {
            await this.plansService.enforceMenuItemLimit(businessId, menuId);
        }
        const item = this.menuItemsRepository.create({
            ...data,
            menuId,
            tenantId,
        });
        return await this.menuItemsRepository.save(item);
    }
    async updateItem(id, data, tenantId) {
        await this.menuItemsRepository.update({ id, tenantId }, data);
        const updated = await this.menuItemsRepository.findOne({
            where: { id, tenantId },
            relations: { menu: true },
        });
        if (updated && updated.menu?.businessId) {
            this.menuGateway.emitMenuItemUpdated(updated.menu.businessId, {
                itemId: updated.id,
                soldOut: updated.soldOut,
                available: updated.available,
                updatedAt: updated.updatedAt.toISOString(),
            });
        }
        return updated;
    }
    async removeItem(id, tenantId) {
        await this.menuItemsRepository.delete({ id, tenantId });
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_category_entity_1.MenuCategory)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __param(3, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        menu_gateway_1.MenuGateway,
        plans_service_1.PlansService])
], MenusService);
//# sourceMappingURL=menus.service.js.map