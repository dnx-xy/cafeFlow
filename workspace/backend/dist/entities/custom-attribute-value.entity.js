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
exports.CustomAttributeValue = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const custom_attribute_entity_1 = require("./custom-attribute.entity");
const order_item_entity_1 = require("./order-item.entity");
let CustomAttributeValue = class CustomAttributeValue extends base_entity_1.BaseEntity {
};
exports.CustomAttributeValue = CustomAttributeValue;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttributeValue.prototype, "attributeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttributeValue.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttributeValue.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomAttributeValue.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => custom_attribute_entity_1.CustomAttribute, (attribute) => attribute.values),
    __metadata("design:type", custom_attribute_entity_1.CustomAttribute)
], CustomAttributeValue.prototype, "attribute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_entity_1.OrderItem, (item) => item.customAttributes),
    __metadata("design:type", order_item_entity_1.OrderItem)
], CustomAttributeValue.prototype, "orderItem", void 0);
exports.CustomAttributeValue = CustomAttributeValue = __decorate([
    (0, typeorm_1.Entity)('custom_attribute_values')
], CustomAttributeValue);
//# sourceMappingURL=custom-attribute-value.entity.js.map