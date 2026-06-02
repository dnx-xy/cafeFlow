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
exports.CustomAttribute = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const menu_item_entity_1 = require("./menu-item.entity");
const custom_attribute_value_entity_1 = require("./custom-attribute-value.entity");
let CustomAttribute = class CustomAttribute extends base_entity_1.BaseEntity {
};
exports.CustomAttribute = CustomAttribute;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttribute.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttribute.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttribute.prototype, "menuItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttribute.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, (item) => item.customAttributes),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], CustomAttribute.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => custom_attribute_value_entity_1.CustomAttributeValue, (value) => value.attribute),
    __metadata("design:type", Array)
], CustomAttribute.prototype, "values", void 0);
exports.CustomAttribute = CustomAttribute = __decorate([
    (0, typeorm_1.Entity)('custom_attributes')
], CustomAttribute);
//# sourceMappingURL=custom-attribute.entity.js.map