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
exports.MenuOptionValue = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_option_entity_1 = require("./menu-option.entity");
let MenuOptionValue = class MenuOptionValue extends base_entity_1.BaseEntity {
};
exports.MenuOptionValue = MenuOptionValue;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOptionValue.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MenuOptionValue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], MenuOptionValue.prototype, "priceAdjustment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MenuOptionValue.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOptionValue.prototype, "menuOptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MenuOptionValue.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_option_entity_1.MenuOption, (option) => option.options),
    __metadata("design:type", menu_option_entity_1.MenuOption)
], MenuOptionValue.prototype, "menuOption", void 0);
exports.MenuOptionValue = MenuOptionValue = __decorate([
    (0, typeorm_1.Entity)('menu_option_values')
], MenuOptionValue);
//# sourceMappingURL=menu-option-value.entity.js.map