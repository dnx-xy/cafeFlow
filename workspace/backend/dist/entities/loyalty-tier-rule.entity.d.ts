import { BaseEntity } from './base.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
export declare class LoyaltyTierRule extends BaseEntity {
    name: string;
    description: string;
    minPoints: number;
    maxPoints: number;
    tierLevel: number;
    benefits: any;
    loyaltyProgramId: string;
    tenantId: string;
    loyaltyProgram: LoyaltyProgram;
}
