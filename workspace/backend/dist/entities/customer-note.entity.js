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
exports.CustomerNote = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const customer_entity_1 = require("./customer.entity");
let CustomerNote = class CustomerNote extends base_entity_1.BaseEntity {
};
exports.CustomerNote = CustomerNote;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerNote.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CustomerNote.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerNote.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CustomerNote.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.customerNotes),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerNote.prototype, "customer", void 0);
exports.CustomerNote = CustomerNote = __decorate([
    (0, typeorm_1.Entity)('customer_notes')
], CustomerNote);
//# sourceMappingURL=customer-note.entity.js.map