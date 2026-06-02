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
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, customersRepository, tablesRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.customersRepository = customersRepository;
        this.tablesRepository = tablesRepository;
    }
    async create(orderData, tenantId) {
        const order = this.ordersRepository.create({
            ...orderData,
            tenantId,
            orderId: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        });
        return await this.ordersRepository.save(order);
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
            where.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        return await this.ordersRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, tenantId) {
        return await this.ordersRepository.findOne({
            where: { id, tenantId },
            relations: { customer: true, table: true, orderItems: { menuItem: true } },
        });
    }
    async updateStatus(id, status, tenantId) {
        await this.ordersRepository.update({ id, tenantId }, { status });
        return await this.findOne(id, tenantId);
    }
    async update(id, updateOrderDto, tenantId) {
        await this.ordersRepository.update({ id, tenantId }, updateOrderDto);
        return await this.findOne(id, tenantId);
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map