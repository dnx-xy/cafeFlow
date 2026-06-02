import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from './enums';
import { Table } from './table.entity';
import { Outlet } from './outlet.entity';
import { Business } from './business.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusUpdate } from './order-status-update.entity';
import { OrderNote } from './order-note.entity';
import { CustomerFeedback } from './customer-feedback.entity';
import { PointTransaction } from './point-transaction.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ unique: true })
  orderId: string;

  @Column({ nullable: true })
  orderIdPrefix: string;

  @Column({ nullable: true })
  tableId: string;

  @Column({ type: 'varchar' })
  outletId: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderType })
  orderType: OrderType;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({ type: 'float', nullable: true })
  discountAmount: number;

  @Column({ type: 'float', nullable: true })
  taxAmount: number;

  @Column({ type: 'float' })
  finalAmount: number;

  @Column({ default: 'IDR' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  businessId: string;

  @ManyToOne(() => Business, (business) => business.orders)
  business: Business;

  @ManyToOne(() => Table, (table) => table.orders, { nullable: true })
  table: Table;

  @ManyToOne(() => Outlet, (outlet) => outlet.orders)
  outlet: Outlet;

  @ManyToOne(() => Customer, (customer) => customer.orders, { nullable: true })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  @OneToMany(() => OrderStatusUpdate, (update) => update.order)
  orderStatusUpdates: OrderStatusUpdate[];

  @OneToMany(() => OrderNote, (note) => note.order)
  orderNotes: OrderNote[];

  @OneToMany(() => CustomerFeedback, (feedback) => feedback.order)
  customerFeedback: CustomerFeedback[];

  @OneToMany(() => PointTransaction, (transaction) => transaction.order)
  pointTransactions: PointTransaction[];
}