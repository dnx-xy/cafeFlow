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

      this.notificationGateway.emitNewOrder(businessId, {
        id: saved.id,
        orderId: saved.orderId,
        tableNumber: saved.tableId,
        status: saved.status,
        totalAmount: saved.totalAmount,
        customer: saved.customerId,
        createdAt: saved.createdAt.toISOString(),
      });

      if (business?.whatsappNumber) {
        const session = `business-${businessId}`;
        this.whatsAppService.sendOrderNotification(
          business.whatsappNumber,
          saved.orderId,
          saved.tableId,
          [],
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
  ): Promise<Order[]> {
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
    
    return await this.ordersRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Order> {
    return await this.ordersRepository.findOne({
      where: { id, tenantId },
      relations: { customer: true, table: true, orderItems: { menuItem: true } },
    });
  }

  async updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<Order> {
    await this.ordersRepository.update(
      { id, tenantId },
      { status },
    );
    const updated = await this.findOne(id, tenantId);
    if (updated?.businessId) {
      this.notificationGateway.emitNewOrder(updated.businessId, {
        id: updated.id,
        orderId: updated.orderId,
        tableNumber: updated.tableId,
        status: updated.status,
        totalAmount: updated.totalAmount,
        customer: updated.customerId,
        createdAt: updated.createdAt.toISOString(),
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