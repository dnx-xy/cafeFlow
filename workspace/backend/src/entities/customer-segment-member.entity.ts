import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { CustomerSegment } from './customer-segment.entity';

@Entity('customer_segment_members')
export class CustomerSegmentMember extends BaseEntity {
  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'varchar' })
  segmentId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'timestamp' })
  joinedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.segments)
  customer: Customer;

  @ManyToOne(() => CustomerSegment, (segment) => segment.customerMembers)
  segment: CustomerSegment;
}