import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { Table } from '../entities/table.entity';
import { Business } from '../entities/business.entity';
import { Order } from '../entities/order.entity';
import { OrderItem as OrderItemEntity } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { OrderStatus, OrderType, PaymentStatus } from '../entities/enums';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItemEntity)
    private orderItemsRepository: Repository<OrderItemEntity>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(CustomerFeedback)
    private feedbackRepository: Repository<CustomerFeedback>,
    @InjectRepository(LoyaltyProgram)
    private loyaltyProgramsRepository: Repository<LoyaltyProgram>,
    @InjectRepository(PointTransaction)
    private pointTransactionsRepository: Repository<PointTransaction>,
  ) {}

  async getMenuByTable(tableId: string) {
    const table = await this.tablesRepository.findOne({
      where: { id: tableId },
      relations: { outlet: { business: true } },
    });
    if (!table) throw new NotFoundException('Table not found');

    const menu = await this.menusRepository.findOne({
      where: { outletId: table.outletId, isActive: true },
      relations: { categories: { menuItems: true } },
      order: { createdAt: 'DESC' },
    });
    if (!menu) throw new NotFoundException('No menu found for this table');

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

  async createOrder(data: {
    tableId: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
    notes?: string;
    orderType?: string;
    customerName?: string;
    customerWhatsapp?: string;
  }) {
    const table = await this.tablesRepository.findOne({ where: { id: data.tableId }, relations: { outlet: { business: true } } });
    if (!table) throw new NotFoundException('Table not found');

    const outlet = table.outlet;
    const business = outlet?.business;
    const tenantId = table.tenantId;

    let customer: Customer | null = null;
    if (data.customerWhatsapp) {
      customer = await this.customersRepository.findOne({ where: { whatsappNumber: data.customerWhatsapp, tenantId } });
    }

    const orderItems: OrderItemEntity[] = [];
    let totalAmount = 0;

    for (const item of data.items) {
      const menuItem = await this.menuItemsRepository.findOne({ where: { id: item.menuItemId } });
      if (!menuItem) continue;
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
      status: OrderStatus.PENDING,
      orderType: (data.orderType as OrderType) || OrderType.DINING_IN,
      notes: data.notes || '',
      totalAmount,
      taxAmount: totalAmount * 0.08,
      finalAmount: totalAmount * 1.08,
      currency: 'IDR',
      paymentStatus: PaymentStatus.PENDING,
      orderItems,
    });

    return await this.ordersRepository.save(order);
  }

  async submitFeedback(data: {
    customerName?: string;
    customerWhatsapp?: string;
    rating: number;
    comment?: string;
    orderId?: string;
    tenantId: string;
    businessId?: string;
  }) {
    let customerId: string | undefined;

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

  async joinLoyalty(data: {
    name: string;
    whatsappNumber: string;
    tenantId: string;
    businessId?: string;
  }) {
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
        transactionType: 'EARNED' as any,
        description: 'Welcome bonus - joined loyalty program',
        tenantId: data.tenantId,
      });
      await this.pointTransactionsRepository.save(tx);
    }

    return { customer, message: 'Welcome to our loyalty program!' };
  }
}
