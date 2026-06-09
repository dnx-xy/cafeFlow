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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const customer_entity_1 = require("../entities/customer.entity");
const table_entity_1 = require("../entities/table.entity");
const business_entity_1 = require("../entities/business.entity");
const notification_gateway_1 = require("../notifications/notification.gateway");
const whatsapp_service_1 = require("../notifications/whatsapp.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, customersRepository, tablesRepository, businessesRepository, notificationGateway, whatsAppService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.customersRepository = customersRepository;
        this.tablesRepository = tablesRepository;
        this.businessesRepository = businessesRepository;
        this.notificationGateway = notificationGateway;
        this.whatsAppService = whatsAppService;
    }
    async create(orderData, tenantId) {
        const order = this.ordersRepository.create({
            ...orderData,
            tenantId,
            orderId: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        });
        const saved = await this.ordersRepository.save(order);
        const businessId = orderData.businessId || '';
        if (businessId) {
            const business = await this.businessesRepository.findOne({ where: { id: businessId } });
            let tableNumber;
            if (saved.tableId) {
                const table = await this.tablesRepository.findOne({ where: { id: saved.tableId } });
                tableNumber = table?.number;
            }
            this.notificationGateway.emitNewOrder(businessId, {
                id: saved.id,
                orderId: saved.orderId,
                tableNumber,
                status: saved.status,
                totalAmount: saved.totalAmount,
                customer: saved.customerId,
                createdAt: saved.createdAt.toISOString(),
            });
            if (business?.whatsappNumber) {
                const session = `business-${businessId}`;
                const orderWithItems = await this.ordersRepository.findOne({
                    where: { id: saved.id },
                    relations: { orderItems: { menuItem: true } },
                });
                const items = (orderWithItems?.orderItems || []).map(oi => ({
                    name: oi.menuItem?.name || 'Item',
                    qty: oi.quantity,
                    price: oi.unitPrice,
                }));
                this.whatsAppService.sendOrderNotification(business.whatsappNumber, saved.orderId, tableNumber, items, saved.totalAmount, session);
            }
        }
        return saved;
    }
    async findAll(tenantId, outletId, status, orderType, startDate, endDate) {
        const where = { tenantId };
        if (outletId) {
            where.outletId = outletId;
        }
        if (status) {
            where.status = status;
        }
        if (orderType) {
            where.orderType = orderType;
        }
        if (startDate && endDate) {
            where.createdAt = (0, typeorm_2.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.createdAt = (0, typeorm_2.MoreThanOrEqual)(startDate);
        }
        else if (endDate) {
            where.createdAt = (0, typeorm_2.LessThanOrEqual)(endDate);
        }
        const orders = await this.ordersRepository.find({
            where,
            relations: { orderItems: { menuItem: true }, table: true },
            order: { createdAt: 'DESC' },
        });
        return orders.map(o => ({
            ...o,
            tableNumber: o.table?.number || null,
            table: undefined,
        }));
    }
    async findOne(id, tenantId) {
        const order = await this.ordersRepository.findOne({
            where: { id, tenantId },
            relations: { customer: true, table: true, orderItems: { menuItem: true } },
        });
        if (order) {
            order.tableNumber = order.table?.number || null;
            order.table = undefined;
        }
        return order;
    }
    async updateStatus(id, status, tenantId) {
        const order = await this.ordersRepository.findOne({ where: { id, tenantId } });
        const oldStatus = order?.status;
        await this.ordersRepository.update({ id, tenantId }, { status });
        const updated = await this.findOne(id, tenantId);
        if (updated?.businessId) {
            let tableNumber;
            if (updated.tableId) {
                const table = await this.tablesRepository.findOne({ where: { id: updated.tableId } });
                tableNumber = table?.number;
            }
            this.notificationGateway.emitOrderStatusUpdate(updated.businessId, {
                id: updated.id,
                orderId: updated.orderId,
                tableNumber,
                totalAmount: updated.totalAmount,
                customer: updated.customerId,
                oldStatus: oldStatus || '',
                newStatus: updated.status,
                updatedAt: new Date().toISOString(),
            });
        }
        return updated;
    }
    async update(id, updateOrderDto, tenantId) {
        await this.ordersRepository.update({ id, tenantId }, updateOrderDto);
        const updated = await this.findOne(id, tenantId);
        if (updated?.businessId && updateOrderDto.paymentStatus) {
            const business = await this.businessesRepository.findOne({ where: { id: updated.businessId } });
            this.notificationGateway.emitPaymentUpdate(updated.businessId, {
                orderId: updated.orderId,
                paymentStatus: updateOrderDto.paymentStatus,
                totalAmount: updated.totalAmount,
                updatedAt: new Date().toISOString(),
            });
            if (business?.whatsappNumber) {
                const session = `business-${updated.businessId}`;
                this.whatsAppService.sendPaymentNotification(business.whatsappNumber, updated.orderId, updated.totalAmount, updateOrderDto.paymentStatus, session);
            }
        }
        return updated;
    }
    async remove(id, tenantId) {
        await this.ordersRepository.delete({ id, tenantId });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(4, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_gateway_1.NotificationGateway,
        whatsapp_service_1.WhatsAppService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map