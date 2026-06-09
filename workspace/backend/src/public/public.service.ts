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
import { OrderItemMenuOption } from '../entities/order-item-menu-option.entity';
import { Customer } from '../entities/customer.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { OrderStatus, OrderType, PaymentStatus } from '../entities/enums';
import { NotificationGateway } from '../notifications/notification.gateway';
import { WhatsAppService } from '../notifications/whatsapp.service';

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
    @InjectRepository(OrderItemMenuOption)
    private orderItemMenuOptionsRepository: Repository<OrderItemMenuOption>,
    private notificationGateway: NotificationGateway,
    private whatsAppService: WhatsAppService,
  ) {}

  async getMenuByTable(tableId: string) {
    const table = await this.tablesRepository.findOne({
      where: { id: tableId },
      relations: { outlet: { business: true } },
    });
    if (!table) throw new NotFoundException('Table not found');

    const menu = await this.menusRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.categories', 'category')
      .leftJoinAndSelect('category.menuItems', 'menuItem')
      .leftJoinAndSelect('menuItem.menuOptions', 'menuOption')
      .leftJoinAndSelect('menuOption.options', 'optionValue')
      .where('menu.outletId = :outletId', { outletId: table.outletId })
      .andWhere('menu.isActive = :isActive', { isActive: true })
      .orderBy('menu.createdAt', 'DESC')
      .addOrderBy('category.sortIndex', 'ASC')
      .addOrderBy('menuItem.categorySortIndex', 'ASC')
      .addOrderBy('menuOption.createdAt', 'ASC')
      .getOne();
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
        hours: '08:00 - 22:00',
        tableNumber: table.number,
        logo: business?.logoUrl || '',
        outletId: table.outletId,
        tenantId: table.tenantId,
        businessId: business?.id,
        currency: business?.currency || 'IDR',
        phoneNumber: outlet?.phoneNumber || business?.ownerId || '',
      },
    };
  }

  async getMenuItem(itemId: string) {
    const item = await this.menuItemsRepository.findOne({
      where: { id: itemId },
      relations: { menuOptions: { options: true } },
      order: { menuOptions: { createdAt: 'ASC' as any } },
    });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async createOrder(data: {
    tableId: string;
    items: { menuItemId: string; quantity: number; notes?: string; options?: { optionValueId: string; priceAdjustment?: number }[] }[];
    notes?: string;
    orderType?: string;
    customerName?: string;
    customerWhatsapp?: string;
    paymentMethod?: string;
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
      const menuItem = await this.menuItemsRepository.findOne({
        where: { id: item.menuItemId },
        relations: { menuOptions: { options: true } },
      });
      if (!menuItem) continue;

      let optionAdjustment = 0;
      const selectedOptionValues: OrderItemMenuOption[] = [];

      if (item.options?.length) {
        for (const sel of item.options) {
          for (const opt of menuItem.menuOptions || []) {
            const val = opt.options?.find(v => v.id === sel.optionValueId);
            if (val) {
              const adj = sel.priceAdjustment ?? val.priceAdjustment ?? 0;
              optionAdjustment += adj;
              const optRec = this.orderItemMenuOptionsRepository.create({
                option: { id: opt.id },
                optionValueId: val.id,
                quantity: item.quantity,
                priceAdjustment: adj,
                tenantId,
              });
              selectedOptionValues.push(optRec);
            }
          }
        }
      }

      const unitPrice = menuItem.price + optionAdjustment;
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;
      const orderItem = this.orderItemsRepository.create({
        menuItem: { id: item.menuItemId },
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        notes: item.notes || '',
        tenantId,
        menuOptions: selectedOptionValues,
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
      paymentMethod: data.paymentMethod as any || undefined,
      paymentStatus: PaymentStatus.PENDING,
      orderItems,
    });

    const saved = await this.ordersRepository.save(order);

    const savedWithItems = await this.ordersRepository.findOne({
      where: { id: saved.id },
      relations: { orderItems: { menuItem: true } },
    });

    const bId = business?.id || '';
    if (bId) {
      this.notificationGateway.emitNewOrder(bId, {
        id: saved.id,
        orderId: saved.orderId,
        tableNumber: table.number,
        status: saved.status,
        totalAmount: saved.totalAmount,
        customer: customer?.id || null,
        createdAt: saved.createdAt.toISOString(),
      });

      if (business?.whatsappNumber) {
        const session = `business-${bId}`;
        const items = (savedWithItems?.orderItems || []).map(oi => ({
          name: oi.menuItem?.name || 'Item',
          qty: oi.quantity,
          price: oi.unitPrice,
        }));
        this.whatsAppService.sendOrderNotification(
          business.whatsappNumber,
          saved.orderId,
          table.number,
          items,
          saved.totalAmount,
          session,
        );
      }
    }

    return { ...saved, tableNumber: table.number };
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
