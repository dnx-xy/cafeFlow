import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LoyaltyProgram } from './loyalty-program.entity';

@Entity('loyalty_tier_rules')
export class LoyaltyTierRule extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  minPoints: number;

  @Column({ type: 'int', nullable: true })
  maxPoints: number;

  @Column({ type: 'int' })
  tierLevel: number;

  @Column({ type: 'json' })
  benefits: any;

  @Column({ type: 'varchar' })
  loyaltyProgramId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => LoyaltyProgram, (program) => program.loyaltyTierRules)
  loyaltyProgram: LoyaltyProgram;
}