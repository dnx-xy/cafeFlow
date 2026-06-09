import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { CustomerSegment } from './customer-segment.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'varchar', default: 'real', nullable: true })
  type: string;

  @OneToMany(() => Business, (business) => business.tenant)
  businesses: Business[];

  @OneToMany(() => Customer, (customer) => customer.tenant)
  customers: Customer[];

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => CustomerSegment, (segment) => segment.tenant)
  customerSegments: CustomerSegment[];
}