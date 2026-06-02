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
exports.Outlet = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const business_entity_1 = require("./business.entity");
const table_entity_1 = require("./table.entity");
const menu_entity_1 = require("./menu.entity");
const order_entity_1 = require("./order.entity");
const staff_entity_1 = require("./staff.entity");
let Outlet = class Outlet extends base_entity_1.BaseEntity {
};
exports.Outlet = Outlet;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Outlet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Outlet.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Outlet.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.outlets),
    __metadata("design:type", business_entity_1.Business)
], Outlet.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => table_entity_1.Table, (table) => table.outlet),
    __metadata("design:type", Array)
], Outlet.prototype, "tables", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_entity_1.Menu, (menu) => menu.outlet),
    __metadata("design:type", Array)
], Outlet.prototype, "menus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.outlet),
    __metadata("design:type", Array)
], Outlet.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_entity_1.Staff, (staff) => staff.outlet),
    __metadata("design:type", Array)
], Outlet.prototype, "staffMembers", void 0);
exports.Outlet = Outlet = __decorate([
    (0, typeorm_1.Entity)('outlets')
], Outlet);
//# sourceMappingURL=outlet.entity.js.map