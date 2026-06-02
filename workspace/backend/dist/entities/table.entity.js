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
exports.Table = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const outlet_entity_1 = require("./outlet.entity");
const order_entity_1 = require("./order.entity");
const qr_code_entity_1 = require("./qr-code.entity");
let Table = class Table extends base_entity_1.BaseEntity {
};
exports.Table = Table;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Table.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Table.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Table.prototype, "outletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Table.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => outlet_entity_1.Outlet, (outlet) => outlet.tables),
    __metadata("design:type", outlet_entity_1.Outlet)
], Table.prototype, "outlet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.table),
    __metadata("design:type", Array)
], Table.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => qr_code_entity_1.QrCode, (qrCode) => qrCode.table),
    __metadata("design:type", Array)
], Table.prototype, "qrCodes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => qr_code_entity_1.QrCode, (qrCode) => qrCode.table),
    __metadata("design:type", qr_code_entity_1.QrCode)
], Table.prototype, "qrCode", void 0);
exports.Table = Table = __decorate([
    (0, typeorm_1.Entity)('tables')
], Table);
//# sourceMappingURL=table.entity.js.map