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
exports.Menu = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const outlet_entity_1 = require("./outlet.entity");
const business_entity_1 = require("./business.entity");
const menu_category_entity_1 = require("./menu-category.entity");
const menu_group_entity_1 = require("./menu-group.entity");
const promotion_entity_1 = require("./promotion.entity");
let Menu = class Menu extends base_entity_1.BaseEntity {
};
exports.Menu = Menu;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Menu.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Menu.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Menu.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Menu.prototype, "outletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Menu.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Menu.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.menus),
    __metadata("design:type", business_entity_1.Business)
], Menu.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => outlet_entity_1.Outlet, (outlet) => outlet.menus),
    __metadata("design:type", outlet_entity_1.Outlet)
], Menu.prototype, "outlet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_category_entity_1.MenuCategory, (category) => category.menu),
    __metadata("design:type", Array)
], Menu.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_group_entity_1.MenuGroup, (group) => group.menu),
    __metadata("design:type", Array)
], Menu.prototype, "menuGroups", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotion_entity_1.Promotion, (promotion) => promotion.menu),
    __metadata("design:type", Array)
], Menu.prototype, "promotions", void 0);
exports.Menu = Menu = __decorate([
    (0, typeorm_1.Entity)('menus')
], Menu);
//# sourceMappingURL=menu.entity.js.map