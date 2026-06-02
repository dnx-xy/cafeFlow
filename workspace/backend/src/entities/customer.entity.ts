import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { CustomerSegmentMember } from './customer-segment-member.entity';
import { PointTransaction } from './point-transaction.entity';
import { CustomerNote } from './customer-note.entity';
import { CustomerFeedback } from './customer-feedback.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  whatsappNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastVisit: Date;

  @Column({ type: 'float', default: 0 })
  totalSpent: number;

  @Column({ type: 'int', default: 0 })
  visitCount: number;

  @Column({ nullable: true })
  favoriteMenuItemId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ nullable: true })
  businessId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.customers)
  tenant: Tenant;

  @ManyToOne(() => Business, (business) => business.customers, { nullable: true })
  business: Business;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => CustomerSegmentMember, (member) => member.customer)
  segments: CustomerSegmentMember[];

  @OneToMany(() => PointTransaction, (transaction) => transaction.customer)
  loyaltyPoints: PointTransaction[];

  @OneToMany(() => CustomerNote, (note) => note.customer)
  customerNotes: CustomerNote[];

  @OneToMany(() => CustomerFeedback, (feedback) => feedback.customer)
  customerFeedback: CustomerFeedback[];

  @ManyToOne(() => User, (user) => user.customer, { nullable: true })
  user: User;
}