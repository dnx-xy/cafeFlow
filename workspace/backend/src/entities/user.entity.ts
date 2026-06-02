import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Business } from './business.entity';
import { Staff } from './staff.entity';
import { Order } from './order.entity';
import { Customer } from './customer.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_OWNER = 'TENANT_OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  businessId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;

  @ManyToOne(() => Business, (business) => business.users)
  business: Business;

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;
}