import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
import { Order } from './order.entity';
export declare enum TransactionType {
    EARNED = "EARNED",
    SPENT = "SPENT"
}
export declare class PointTransaction extends BaseEntity {
    customerId: string;
    loyaltyProgramId: string;
    points: number;
    transactionType: TransactionType;
    description: string;
    orderId: string;
    referenceId: string;
    tenantId: string;
    customer: Customer;
    loyaltyProgram: LoyaltyProgram;
    order: Order;
}
