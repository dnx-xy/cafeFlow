import { LoyaltyService } from './loyalty.service';
export declare class LoyaltyController {
    private readonly loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    getLoyaltyProgram(user: any): Promise<import("../entities/loyalty-program.entity").LoyaltyProgram>;
    createPointsTransaction(body: any, user: any): Promise<import("../entities/point-transaction.entity").PointTransaction>;
    getCustomerPoints(customerId: string, user: any): Promise<{
        points: number;
    }>;
}
