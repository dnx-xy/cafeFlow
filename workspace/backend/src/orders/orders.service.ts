import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/enums';
import { OrderItem } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { Table } from '../entities/table.entity';

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
  ) {}

  async create(orderData: Partial<Order>, tenantId: string): Promise<Order> {
    const order = this.ordersRepository.create({
      ...orderData,
      tenantId,
      orderId: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    });
    return await this.ordersRepository.save(order);
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
    return await this.findOne(id, tenantId);
  }

  async update(id: string, updateOrderDto: Partial<Order>, tenantId: string): Promise<Order> {
    await this.ordersRepository.update(
      { id, tenantId },
      updateOrderDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.ordersRepository.delete({ id, tenantId });
  }
}