import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { CustomerSegmentMember } from './customer-segment-member.entity';

@Entity('customer_segments')
export class CustomerSegment extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json' })
  criteria: any;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.customerSegments)
  tenant: Tenant;

  @OneToMany(() => CustomerSegmentMember, (member) => member.segment)
  customerMembers: CustomerSegmentMember[];
}