import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';

@Entity('customer_feedback')
export class CustomerFeedback extends BaseEntity {
  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Customer, (customer) => customer.customerFeedback)
  customer: Customer;

  @ManyToOne(() => Order, (order) => order.customerFeedback)
  order: Order;
}