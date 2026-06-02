import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { Table } from './table.entity';
import { Menu } from './menu.entity';
import { Order } from './order.entity';
import { Staff } from './staff.entity';

@Entity('outlets')
export class Outlet extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  businessId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Business, (business) => business.outlets)
  business: Business;

  @OneToMany(() => Table, (table) => table.outlet)
  tables: Table[];

  @OneToMany(() => Menu, (menu) => menu.outlet)
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.outlet)
  orders: Order[];

  @OneToMany(() => Staff, (staff) => staff.outlet)
  staffMembers: Staff[];
}