import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Table } from './table.entity';
import { Outlet } from './outlet.entity';
import { Order } from './order.entity';

@Entity('qr_codes')
export class QrCode extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar' })
  tableId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  usageCount: number;

  @ManyToOne(() => Table, (table) => table.qrCode)
  table: Table;
}