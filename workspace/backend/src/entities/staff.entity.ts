import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Outlet } from './outlet.entity';

export enum StaffRoleId {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CHEF = 'CHEF',
  CASHIER = 'CASHIER'
}

@Entity('staff')
export class Staff extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  outletId: string;

  @Column({ type: 'enum', enum: StaffRoleId })
  roleId: StaffRoleId;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => User, (user) => user.staff)
  user: User;

  @ManyToOne(() => Outlet, (outlet) => outlet.staffMembers)
  outlet: Outlet;
}