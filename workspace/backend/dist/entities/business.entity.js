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
exports.Business = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const outlet_entity_1 = require("./outlet.entity");
const user_entity_1 = require("./user.entity");
const menu_entity_1 = require("./menu.entity");
const order_entity_1 = require("./order.entity");
const customer_entity_1 = require("./customer.entity");
const loyalty_program_entity_1 = require("./loyalty-program.entity");
const qr_code_entity_1 = require("./qr-code.entity");
let Business = class Business extends base_entity_1.BaseEntity {
};
exports.Business = Business;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Business.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Business.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'FREE' }),
    __metadata("design:type", String)
], Business.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'USD' }),
    __metadata("design:type", String)
], Business.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Business.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Business.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.businesses),
    __metadata("design:type", tenant_entity_1.Tenant)
], Business.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => outlet_entity_1.Outlet, (outlet) => outlet.business),
    __metadata("design:type", Array)
], Business.prototype, "outlets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.business),
    __metadata("design:type", Array)
], Business.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_entity_1.Menu, (menu) => menu.business),
    __metadata("design:type", Array)
], Business.prototype, "menus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.business),
    __metadata("design:type", Array)
], Business.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_entity_1.Customer, (customer) => customer.business),
    __metadata("design:type", Array)
], Business.prototype, "customers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loyalty_program_entity_1.LoyaltyProgram, (program) => program.business),
    __metadata("design:type", Array)
], Business.prototype, "loyaltyPrograms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => qr_code_entity_1.QrCode, (qrCode) => qrCode.business),
    __metadata("design:type", Array)
], Business.prototype, "qrCodes", void 0);
exports.Business = Business = __decorate([
    (0, typeorm_1.Entity)('businesses')
], Business);
//# sourceMappingURL=business.entity.js.map