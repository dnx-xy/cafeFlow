import { BaseEntity } from './base.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
export declare enum RewardType {
    DISCOUNT = "DISCOUNT",
    FREE_ITEM = "FREE_ITEM",
    VOUCHER = "VOUCHER",
    EXCLUSIVE_ACCESS = "EXCLUSIVE_ACCESS"
}
export declare class LoyaltyReward extends BaseEntity {
    name: string;
    description: string;
    pointsRequired: number;
    rewardType: RewardType;
    discountValue: number;
    freeItemMenuId: string;
    isActive: boolean;
    loyaltyProgramId: string;
    tenantId: string;
    loyaltyProgram: LoyaltyProgram;
}
