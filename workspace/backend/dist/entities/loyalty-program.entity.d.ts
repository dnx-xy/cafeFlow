import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { PointTransaction } from './point-transaction.entity';
import { LoyaltyReward } from './loyalty-reward.entity';
import { LoyaltyTierRule } from './loyalty-tier-rule.entity';
export declare class LoyaltyProgram extends BaseEntity {
    name: string;
    description: string;
    pointsPerRupiah: number;
    minimumPurchase: number;
    maximumPointsPerOrder: number;
    isActive: boolean;
    businessId: string;
    tenantId: string;
    business: Business;
    pointsTransactions: PointTransaction[];
    loyaltyRewards: LoyaltyReward[];
    loyaltyTierRules: LoyaltyTierRule[];
}
