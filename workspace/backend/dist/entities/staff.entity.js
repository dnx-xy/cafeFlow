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
exports.Staff = exports.StaffRoleId = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const outlet_entity_1 = require("./outlet.entity");
var StaffRoleId;
(function (StaffRoleId) {
    StaffRoleId["ADMIN"] = "ADMIN";
    StaffRoleId["MANAGER"] = "MANAGER";
    StaffRoleId["WAITER"] = "WAITER";
    StaffRoleId["CHEF"] = "CHEF";
    StaffRoleId["CASHIER"] = "CASHIER";
})(StaffRoleId || (exports.StaffRoleId = StaffRoleId = {}));
let Staff = class Staff extends base_entity_1.BaseEntity {
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Staff.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Staff.prototype, "outletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StaffRoleId }),
    __metadata("design:type", String)
], Staff.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Staff.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Staff.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.staff),
    __metadata("design:type", user_entity_1.User)
], Staff.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => outlet_entity_1.Outlet, (outlet) => outlet.staffMembers),
    __metadata("design:type", outlet_entity_1.Outlet)
], Staff.prototype, "outlet", void 0);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.Entity)('staff')
], Staff);
//# sourceMappingURL=staff.entity.js.map