import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum WhatsAppDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

@Entity('whatsapp_messages')
export class WhatsAppMessage extends BaseEntity {
  @Column({ type: 'varchar' })
  businessId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  sessionId: string;

  @Column({ type: 'varchar' })
  fromNumber: string;

  @Column({ type: 'varchar', nullable: true })
  toNumber: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: WhatsAppDirection })
  direction: WhatsAppDirection;

  @Column({ type: 'varchar', default: 'sent' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  waMessageId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
