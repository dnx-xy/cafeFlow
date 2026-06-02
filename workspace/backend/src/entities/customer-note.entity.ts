import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';

@Entity('customer_notes')
export class CustomerNote extends BaseEntity {
  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'text' })
  note: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Customer, (customer) => customer.customerNotes)
  customer: Customer;
}