import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { CustomerSegment } from './customer-segment.entity';
export declare class Tenant extends BaseEntity {
    name: string;
    slug: string;
    type: string;
    businesses: Business[];
    customers: Customer[];
    users: User[];
    customerSegments: CustomerSegment[];
}
