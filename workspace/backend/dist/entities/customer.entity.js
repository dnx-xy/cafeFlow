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
exports.Customer = exports.Gender = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const business_entity_1 = require("./business.entity");
const user_entity_1 = require("./user.entity");
const order_entity_1 = require("./order.entity");
const customer_segment_member_entity_1 = require("./customer-segment-member.entity");
const point_transaction_entity_1 = require("./point-transaction.entity");
const customer_note_entity_1 = require("./customer-note.entity");
const customer_feedback_entity_1 = require("./customer-feedback.entity");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
let Customer = class Customer extends base_entity_1.BaseEntity {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "whatsappNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Gender, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Customer.prototype, "joinDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "lastVisit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "totalSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "visitCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "favoriteMenuItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Customer.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.customers),
    __metadata("design:type", tenant_entity_1.Tenant)
], Customer.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.customers, { nullable: true }),
    __metadata("design:type", business_entity_1.Business)
], Customer.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_segment_member_entity_1.CustomerSegmentMember, (member) => member.customer),
    __metadata("design:type", Array)
], Customer.prototype, "segments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => point_transaction_entity_1.PointTransaction, (transaction) => transaction.customer),
    __metadata("design:type", Array)
], Customer.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_note_entity_1.CustomerNote, (note) => note.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerNotes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_feedback_entity_1.CustomerFeedback, (feedback) => feedback.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerFeedback", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.customer, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Customer.prototype, "user", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
//# sourceMappingURL=customer.entity.js.map