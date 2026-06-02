import { Repository } from 'typeorm';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
export declare class LoyaltyService {
    private loyaltyProgramsRepository;
    private pointTransactionsRepository;
    constructor(loyaltyProgramsRepository: Repository<LoyaltyProgram>, pointTransactionsRepository: Repository<PointTransaction>);
    getLoyaltyProgram(tenantId: string, businessId: string): Promise<LoyaltyProgram>;
    createPointsTransaction(transactionData: Partial<PointTransaction>, tenantId: string): Promise<PointTransaction>;
    getCustomerPoints(tenantId: string, customerId: string): Promise<number>;
}
