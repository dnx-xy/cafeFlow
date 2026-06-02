import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
export declare class CustomerNote extends BaseEntity {
    customerId: string;
    note: string;
    author: string;
    tenantId: string;
    customer: Customer;
}
