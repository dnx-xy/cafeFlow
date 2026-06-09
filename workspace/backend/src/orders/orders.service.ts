import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/enums';
import { OrderItem } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { Table } from '../entities/table.entity';
import { Business } from '../entities/business.entity';
import { NotificationGateway } from '../notifications/notification.gateway';
import { WhatsAppService } from '../notifications/whatsapp.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    private notificationGateway: NotificationGateway,
    private whatsAppService: WhatsAppService,
  ) {}

  async create(orderData: Partial<Order>, tenantId: string): Promise<Order> {
    const order = this.ordersRepository.create({
      ...orderData,
      tenantId,
      orderId: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    });
    const saved = await this.ordersRepository.save(order);

    const businessId = orderData.businessId || '';
    if (businessId) {
      const business = await this.businessesRepository.findOne({ where: { id: businessId } });

      let tableNumber: string | undefined;
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
        this.whatsAppService.sendOrderNotification(
          business.whatsappNumber,
          saved.orderId,
          tableNumber,
          items,
          saved.totalAmount,
          session,
        );
      }
    }

    return saved;
  }

  async findAll(
    tenantId: string,
    outletId?: string,
    status?: string,
    orderType?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    const where: any = { tenantId };
    
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
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
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

  async findOne(id: string, tenantId: string): Promise<any> {
    const order = await this.ordersRepository.findOne({
      where: { id, tenantId },
      relations: { customer: true, table: true, orderItems: { menuItem: true } },
    });
    if (order) {
      (order as any).tableNumber = order.table?.number || null;
      (order as any).table = undefined;
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id, tenantId } });
    const oldStatus = order?.status;
    await this.ordersRepository.update(
      { id, tenantId },
      { status },
    );
    const updated = await this.findOne(id, tenantId);
    if (updated?.businessId) {
      let tableNumber: string | undefined;
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

  async update(id: string, updateOrderDto: Partial<Order>, tenantId: string): Promise<Order> {
    await this.ordersRepository.update(
      { id, tenantId },
      updateOrderDto,
    );
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
        this.whatsAppService.sendPaymentNotification(
          business.whatsappNumber,
          updated.orderId,
          updated.totalAmount,
          updateOrderDto.paymentStatus,
          session,
        );
      }
    }
    return updated;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.ordersRepository.delete({ id, tenantId });
  }
}