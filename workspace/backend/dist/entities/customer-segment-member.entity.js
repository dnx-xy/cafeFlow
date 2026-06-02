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
exports.CustomerSegmentMember = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const customer_entity_1 = require("./customer.entity");
const customer_segment_entity_1 = require("./customer-segment.entity");
let CustomerSegmentMember = class CustomerSegmentMember extends base_entity_1.BaseEntity {
};
exports.CustomerSegmentMember = CustomerSegmentMember;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerSegmentMember.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerSegmentMember.prototype, "segmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerSegmentMember.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CustomerSegmentMember.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.segments),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerSegmentMember.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_segment_entity_1.CustomerSegment, (segment) => segment.customerMembers),
    __metadata("design:type", customer_segment_entity_1.CustomerSegment)
], CustomerSegmentMember.prototype, "segment", void 0);
exports.CustomerSegmentMember = CustomerSegmentMember = __decorate([
    (0, typeorm_1.Entity)('customer_segment_members')
], CustomerSegmentMember);
//# sourceMappingURL=customer-segment-member.entity.js.map