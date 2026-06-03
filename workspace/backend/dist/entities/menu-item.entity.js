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
exports.MenuItem = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_category_entity_1 = require("./menu-category.entity");
const menu_group_entity_1 = require("./menu-group.entity");
const menu_entity_1 = require("./menu.entity");
const custom_attribute_entity_1 = require("./custom-attribute.entity");
const menu_option_entity_1 = require("./menu-option.entity");
const order_item_entity_1 = require("./order-item.entity");
const promotion_item_entity_1 = require("./promotion-item.entity");
let MenuItem = class MenuItem extends base_entity_1.BaseEntity {
};
exports.MenuItem = MenuItem;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], MenuItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "soldOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "hidden", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MenuItem.prototype, "stockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MenuItem.prototype, "categorySortIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MenuItem.prototype, "groupSortIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MenuItem.prototype, "popularityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "isSpecialOffer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "menuCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "menuGroupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuItem.prototype, "menuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuItem.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_category_entity_1.MenuCategory, (category) => category.menuItems, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'menuCategoryId' }),
    __metadata("design:type", menu_category_entity_1.MenuCategory)
], MenuItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_group_entity_1.MenuGroup, (group) => group.menuItems, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'menuGroupId' }),
    __metadata("design:type", menu_group_entity_1.MenuGroup)
], MenuItem.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_entity_1.Menu, (menu) => menu.categories),
    __metadata("design:type", menu_entity_1.Menu)
], MenuItem.prototype, "menu", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => custom_attribute_entity_1.CustomAttribute, (attribute) => attribute.menuItem),
    __metadata("design:type", Array)
], MenuItem.prototype, "customAttributes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_option_entity_1.MenuOption, (option) => option.menuItem),
    __metadata("design:type", Array)
], MenuItem.prototype, "menuOptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (item) => item.menuItem),
    __metadata("design:type", Array)
], MenuItem.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotion_item_entity_1.PromotionItem, (item) => item.menuItem),
    __metadata("design:type", Array)
], MenuItem.prototype, "promotionItems", void 0);
exports.MenuItem = MenuItem = __decorate([
    (0, typeorm_1.Entity)('menu_items')
], MenuItem);
//# sourceMappingURL=menu-item.entity.js.map