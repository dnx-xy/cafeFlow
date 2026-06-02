import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';
export declare class CustomerFeedback extends BaseEntity {
    customerId: string;
    orderId: string;
    rating: number;
    comment: string;
    tenantId: string;
    customer: Customer;
    order: Order;
}
