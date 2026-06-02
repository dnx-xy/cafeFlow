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
exports.MenuCategory = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_entity_1 = require("./menu.entity");
const menu_item_entity_1 = require("./menu-item.entity");
let MenuCategory = class MenuCategory extends base_entity_1.BaseEntity {
};
exports.MenuCategory = MenuCategory;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuCategory.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MenuCategory.prototype, "sortIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MenuCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuCategory.prototype, "menuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuCategory.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_entity_1.Menu, (menu) => menu.categories),
    __metadata("design:type", menu_entity_1.Menu)
], MenuCategory.prototype, "menu", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_item_entity_1.MenuItem, (item) => item.category),
    __metadata("design:type", Array)
], MenuCategory.prototype, "menuItems", void 0);
exports.MenuCategory = MenuCategory = __decorate([
    (0, typeorm_1.Entity)('menu_categories')
], MenuCategory);
//# sourceMappingURL=menu-category.entity.js.map