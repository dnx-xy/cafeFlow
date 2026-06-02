import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { CustomerSegment } from './customer-segment.entity';
export declare class CustomerSegmentMember extends BaseEntity {
    customerId: string;
    segmentId: string;
    tenantId: string;
    joinedAt: Date;
    customer: Customer;
    segment: CustomerSegment;
}
