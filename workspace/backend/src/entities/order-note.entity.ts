import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('order_notes')
export class OrderNote extends BaseEntity {
  @Column({ type: 'varchar' })
  orderId: string;

  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Order, (order) => order.orderNotes)
  order: Order;
}