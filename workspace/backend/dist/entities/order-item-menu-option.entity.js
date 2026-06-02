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
exports.OrderItemMenuOption = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_option_entity_1 = require("./menu-option.entity");
const order_item_entity_1 = require("./order-item.entity");
let OrderItemMenuOption = class OrderItemMenuOption extends base_entity_1.BaseEntity {
};
exports.OrderItemMenuOption = OrderItemMenuOption;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderItemMenuOption.prototype, "optionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrderItemMenuOption.prototype, "optionValueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], OrderItemMenuOption.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], OrderItemMenuOption.prototype, "priceAdjustment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderItemMenuOption.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderItemMenuOption.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_option_entity_1.MenuOption, (option) => option.options),
    __metadata("design:type", menu_option_entity_1.MenuOption)
], OrderItemMenuOption.prototype, "option", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_entity_1.OrderItem, (item) => item.menuOptions),
    __metadata("design:type", order_item_entity_1.OrderItem)
], OrderItemMenuOption.prototype, "orderItem", void 0);
exports.OrderItemMenuOption = OrderItemMenuOption = __decorate([
    (0, typeorm_1.Entity)('order_item_menu_options')
], OrderItemMenuOption);
//# sourceMappingURL=order-item-menu-option.entity.js.map