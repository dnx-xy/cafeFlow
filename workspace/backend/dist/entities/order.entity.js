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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const enums_1 = require("./enums");
const table_entity_1 = require("./table.entity");
const outlet_entity_1 = require("./outlet.entity");
const business_entity_1 = require("./business.entity");
const customer_entity_1 = require("./customer.entity");
const user_entity_1 = require("./user.entity");
const order_item_entity_1 = require("./order-item.entity");
const order_status_update_entity_1 = require("./order-status-update.entity");
const order_note_entity_1 = require("./order-note.entity");
const customer_feedback_entity_1 = require("./customer-feedback.entity");
const point_transaction_entity_1 = require("./point-transaction.entity");
let Order = class Order extends base_entity_1.BaseEntity {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "orderIdPrefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Order.prototype, "outletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.OrderStatus }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.OrderType }),
    __metadata("design:type", String)
], Order.prototype, "orderType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Order.prototype, "finalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'IDR' }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.PaymentMethod, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.PaymentStatus }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Order.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Order.prototype, "businessId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.orders),
    __metadata("design:type", business_entity_1.Business)
], Order.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, (table) => table.orders, { nullable: true }),
    __metadata("design:type", table_entity_1.Table)
], Order.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => outlet_entity_1.Outlet, (outlet) => outlet.orders),
    __metadata("design:type", outlet_entity_1.Outlet)
], Order.prototype, "outlet", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.orders, { nullable: true }),
    __metadata("design:type", customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.orders, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, (item) => item.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_status_update_entity_1.OrderStatusUpdate, (update) => update.order),
    __metadata("design:type", Array)
], Order.prototype, "orderStatusUpdates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_note_entity_1.OrderNote, (note) => note.order),
    __metadata("design:type", Array)
], Order.prototype, "orderNotes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_feedback_entity_1.CustomerFeedback, (feedback) => feedback.order),
    __metadata("design:type", Array)
], Order.prototype, "customerFeedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => point_transaction_entity_1.PointTransaction, (transaction) => transaction.order),
    __metadata("design:type", Array)
], Order.prototype, "pointTransactions", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map