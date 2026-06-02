import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
import { Order } from './order.entity';

export enum TransactionType {
  EARNED = 'EARNED',
  SPENT = 'SPENT'
}

@Entity('point_transactions')
export class PointTransaction extends BaseEntity {
  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'varchar' })
  loyaltyProgramId: string;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  orderId: string;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Customer, (customer) => customer.loyaltyPoints)
  customer: Customer;

  @ManyToOne(() => LoyaltyProgram, (program) => program.pointsTransactions)
  loyaltyProgram: LoyaltyProgram;

  @ManyToOne(() => Order, (order) => order.pointTransactions)
  order: Order;
}