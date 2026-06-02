import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { PointTransaction } from './point-transaction.entity';
import { LoyaltyReward } from './loyalty-reward.entity';
import { LoyaltyTierRule } from './loyalty-tier-rule.entity';

@Entity('loyalty_programs')
export class LoyaltyProgram extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', default: 1 })
  pointsPerRupiah: number;

  @Column({ type: 'float', default: 0 })
  minimumPurchase: number;

  @Column({ type: 'float', nullable: true })
  maximumPointsPerOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  businessId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Business, (business) => business.loyaltyPrograms)
  business: Business;

  @OneToMany(() => PointTransaction, (transaction) => transaction.loyaltyProgram)
  pointsTransactions: PointTransaction[];

  @OneToMany(() => LoyaltyReward, (reward) => reward.loyaltyProgram)
  loyaltyRewards: LoyaltyReward[];

  @OneToMany(() => LoyaltyTierRule, (rule) => rule.loyaltyProgram)
  loyaltyTierRules: LoyaltyTierRule[];
}