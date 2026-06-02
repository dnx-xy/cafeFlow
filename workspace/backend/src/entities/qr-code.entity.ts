import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Table } from './table.entity';
import { Business } from './business.entity';

@Entity('qr_codes')
export class QrCode extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  tableId: string;

  @Column({ type: 'varchar' })
  businessId: string;

  @Column({ type: 'timestamp', nullable: true })
  scannedAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => Table, (table) => table.qrCodes)
  table: Table;

  @ManyToOne(() => Business, (business) => business.qrCodes)
  business: Business;
}