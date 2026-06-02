import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Outlet } from './outlet.entity';
import { Order } from './order.entity';
import { QrCode } from './qr-code.entity';

@Entity('tables')
export class Table extends BaseEntity {
  @Column({ type: 'varchar' })
  number: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  outletId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Outlet, (outlet) => outlet.tables)
  outlet: Outlet;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @OneToOne(() => QrCode, (qrCode) => qrCode.table)
  qrCode: QrCode;
}