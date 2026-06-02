import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { OrderStatus } from './enums';

@Entity('order_status_updates')
export class OrderStatusUpdate extends BaseEntity {
  @Column({ type: 'varchar' })
  orderId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ nullable: true })
  changedBy: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Order, (order) => order.orderStatusUpdates)
  order: Order;
}