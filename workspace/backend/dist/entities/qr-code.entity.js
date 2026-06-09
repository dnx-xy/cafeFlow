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
exports.QrCode = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const table_entity_1 = require("./table.entity");
const business_entity_1 = require("./business.entity");
let QrCode = class QrCode extends base_entity_1.BaseEntity {
};
exports.QrCode = QrCode;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], QrCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QrCode.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QrCode.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], QrCode.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], QrCode.prototype, "scannedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], QrCode.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, (table) => table.qrCodes, { nullable: true }),
    __metadata("design:type", table_entity_1.Table)
], QrCode.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.qrCodes),
    __metadata("design:type", business_entity_1.Business)
], QrCode.prototype, "business", void 0);
exports.QrCode = QrCode = __decorate([
    (0, typeorm_1.Entity)('qr_codes')
], QrCode);
//# sourceMappingURL=qr-code.entity.js.map