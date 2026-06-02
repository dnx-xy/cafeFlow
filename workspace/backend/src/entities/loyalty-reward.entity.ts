import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoyaltyProgram } from './loyalty-program.entity';

export enum RewardType {
  DISCOUNT = 'DISCOUNT',
  FREE_ITEM = 'FREE_ITEM',
  VOUCHER = 'VOUCHER',
  EXCLUSIVE_ACCESS = 'EXCLUSIVE_ACCESS'
}

@Entity('loyalty_rewards')
export class LoyaltyReward extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  pointsRequired: number;

  @Column({ type: 'enum', enum: RewardType })
  rewardType: RewardType;

  @Column({ type: 'float', nullable: true })
  discountValue: number;

  @Column({ nullable: true })
  freeItemMenuId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  loyaltyProgramId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => LoyaltyProgram, (program) => program.loyaltyRewards)
  loyaltyProgram: LoyaltyProgram;
}