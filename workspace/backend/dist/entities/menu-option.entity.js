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
exports.MenuOption = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_item_entity_1 = require("./menu-item.entity");
const menu_option_value_entity_1 = require("./menu-option-value.entity");
let MenuOption = class MenuOption extends base_entity_1.BaseEntity {
};
exports.MenuOption = MenuOption;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOption.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuOption.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], MenuOption.prototype, "priceAdjustment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MenuOption.prototype, "required", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOption.prototype, "menuItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOption.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, (item) => item.menuOptions),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], MenuOption.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_option_value_entity_1.MenuOptionValue, (value) => value.menuOption),
    __metadata("design:type", Array)
], MenuOption.prototype, "options", void 0);
exports.MenuOption = MenuOption = __decorate([
    (0, typeorm_1.Entity)('menu_options')
], MenuOption);
//# sourceMappingURL=menu-option.entity.js.map