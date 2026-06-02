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
exports.CustomerSegment = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const customer_segment_member_entity_1 = require("./customer-segment-member.entity");
let CustomerSegment = class CustomerSegment extends base_entity_1.BaseEntity {
};
exports.CustomerSegment = CustomerSegment;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerSegment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerSegment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], CustomerSegment.prototype, "criteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CustomerSegment.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerSegment.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.customerSegments),
    __metadata("design:type", tenant_entity_1.Tenant)
], CustomerSegment.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_segment_member_entity_1.CustomerSegmentMember, (member) => member.segment),
    __metadata("design:type", Array)
], CustomerSegment.prototype, "customerMembers", void 0);
exports.CustomerSegment = CustomerSegment = __decorate([
    (0, typeorm_1.Entity)('customer_segments')
], CustomerSegment);
//# sourceMappingURL=customer-segment.entity.js.map