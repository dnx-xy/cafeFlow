import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Outlet } from './outlet.entity';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
import { QrCode } from './qr-code.entity';

@Entity('businesses')
export class Business extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  countryCode: string;

  @Column({ type: 'varchar', default: 'FREE' })
  plan: string;

  @Column({ type: 'varchar' })
  ownerId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.businesses)
  tenant: Tenant;

  @OneToMany(() => Outlet, (outlet) => outlet.business)
  outlets: Outlet[];

  @OneToMany(() => User, (user) => user.business)
  users: User[];

  @OneToMany(() => Menu, (menu) => menu.business)
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.business)
  orders: Order[];

  @OneToMany(() => Customer, (customer) => customer.business)
  customers: Customer[];

  @OneToMany(() => LoyaltyProgram, (program) => program.business)
  loyaltyPrograms: LoyaltyProgram[];

  @OneToMany(() => QrCode, (qrCode) => qrCode.business)
  qrCodes: QrCode[];
}