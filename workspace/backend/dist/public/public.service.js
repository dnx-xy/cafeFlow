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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("../entities/menu.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const table_entity_1 = require("../entities/table.entity");
const business_entity_1 = require("../entities/business.entity");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const customer_entity_1 = require("../entities/customer.entity");
const customer_feedback_entity_1 = require("../entities/customer-feedback.entity");
const loyalty_program_entity_1 = require("../entities/loyalty-program.entity");
const point_transaction_entity_1 = require("../entities/point-transaction.entity");
const enums_1 = require("../entities/enums");
let PublicService = class PublicService {
    constructor(menusRepository, menuItemsRepository, outletsRepository, tablesRepository, businessesRepository, ordersRepository, orderItemsRepository, customersRepository, feedbackRepository, loyaltyProgramsRepository, pointTransactionsRepository) {
        this.menusRepository = menusRepository;
        this.menuItemsRepository = menuItemsRepository;
        this.outletsRepository = outletsRepository;
        this.tablesRepository = tablesRepository;
        this.businessesRepository = businessesRepository;
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.customersRepository = customersRepository;
        this.feedbackRepository = feedbackRepository;
        this.loyaltyProgramsRepository = loyaltyProgramsRepository;
        this.pointTransactionsRepository = pointTransactionsRepository;
    }
    async getMenuByTable(tableId) {
        const table = await this.tablesRepository.findOne({
            where: { id: tableId },
            relations: { outlet: { business: true } },
        });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        const menu = await this.menusRepository.findOne({
            where: { outletId: table.outletId, isActive: true },
            relations: { categories: { menuItems: true } },
            order: { createdAt: 'DESC' },
        });
        if (!menu)
            throw new common_1.NotFoundException('No menu found for this table');
        const outlet = table.outlet;
        const business = outlet?.business;
        return {
            menu,
            cafe: {
                id: business?.id,
                name: business?.name || outlet?.name || 'Cafe',
                description: outlet?.description || business?.description,
                location: outlet?.address,
                hours: '',
                tableNumber: table.number,
                logo: business?.logoUrl || '',
                outletId: table.outletId,
                tenantId: table.tenantId,
                businessId: business?.id,
            },
        };
    }
    async createOrder(data) {
        const table = await this.tablesRepository.findOne({ where: { id: data.tableId }, relations: { outlet: { business: true } } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        const outlet = table.outlet;
        const business = outlet?.business;
        const tenantId = table.tenantId;
        let customer = null;
        if (data.customerWhatsapp) {
            customer = await this.customersRepository.findOne({ where: { whatsappNumber: data.customerWhatsapp, tenantId } });
        }
        const orderItems = [];
        let totalAmount = 0;
        for (const item of data.items) {
            const menuItem = await this.menuItemsRepository.findOne({ where: { id: item.menuItemId } });
            if (!menuItem)
                continue;
            const itemTotal = menuItem.price * item.quantity;
            totalAmount += itemTotal;
            const orderItem = this.orderItemsRepository.create({
                menuItemId: item.menuItemId,
                orderId: '',
                quantity: item.quantity,
                unitPrice: menuItem.price,
                totalPrice: itemTotal,
                notes: item.notes || '',
                tenantId,
            });
            orderItems.push(orderItem);
        }
        const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;
        const order = this.ordersRepository.create({
            orderId,
            tableId: data.tableId,
            outletId: table.outletId,
            customerId: customer?.id || null,
            businessId: business?.id || '',
            tenantId,
            status: enums_1.OrderStatus.PENDING,
            orderType: data.orderType || enums_1.OrderType.DINING_IN,
            notes: data.notes || '',
            totalAmount,
            taxAmount: totalAmount * 0.08,
            finalAmount: totalAmount * 1.08,
            currency: 'IDR',
            paymentStatus: enums_1.PaymentStatus.PENDING,
            orderItems,
        });
        return await this.ordersRepository.save(order);
    }
    async submitFeedback(data) {
        let customerId;
        if (data.customerWhatsapp) {
            let customer = await this.customersRepository.findOne({
                where: { whatsappNumber: data.customerWhatsapp, tenantId: data.tenantId },
            });
            if (!customer) {
                customer = this.customersRepository.create({
                    name: data.customerName || 'Anonymous',
                    whatsappNumber: data.customerWhatsapp,
                    tenantId: data.tenantId,
                    businessId: data.businessId || '',
                    joinDate: new Date(),
                });
                customer = await this.customersRepository.save(customer);
            }
            customerId = customer.id;
        }
        const feedback = this.feedbackRepository.create({
            customerId: customerId || '',
            orderId: data.orderId || '',
            rating: data.rating,
            comment: data.comment || '',
            tenantId: data.tenantId,
        });
        return await this.feedbackRepository.save(feedback);
    }
    async joinLoyalty(data) {
        let customer = await this.customersRepository.findOne({
            where: { whatsappNumber: data.whatsappNumber, tenantId: data.tenantId },
        });
        if (!customer) {
            customer = this.customersRepository.create({
                name: data.name,
                whatsappNumber: data.whatsappNumber,
                tenantId: data.tenantId,
                businessId: data.businessId || '',
                joinDate: new Date(),
            });
            customer = await this.customersRepository.save(customer);
        }
        const program = await this.loyaltyProgramsRepository.findOne({
            where: { tenantId: data.tenantId, isActive: true },
        });
        if (program) {
            const tx = this.pointTransactionsRepository.create({
                customerId: customer.id,
                loyaltyProgramId: program.id,
                points: 50,
                transactionType: 'EARNED',
                description: 'Welcome bonus - joined loyalty program',
                tenantId: data.tenantId,
            });
            await this.pointTransactionsRepository.save(tx);
        }
        return { customer, message: 'Welcome to our loyalty program!' };
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __param(2, (0, typeorm_1.InjectRepository)(outlet_entity_1.Outlet)),
    __param(3, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(4, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __param(5, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(6, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(7, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(8, (0, typeorm_1.InjectRepository)(customer_feedback_entity_1.CustomerFeedback)),
    __param(9, (0, typeorm_1.InjectRepository)(loyalty_program_entity_1.LoyaltyProgram)),
    __param(10, (0, typeorm_1.InjectRepository)(point_transaction_entity_1.PointTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PublicService);
//# sourceMappingURL=public.service.js.map