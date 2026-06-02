import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { CustomerSegmentMember } from './customer-segment-member.entity';
export declare class CustomerSegment extends BaseEntity {
    name: string;
    description: string;
    criteria: any;
    isActive: boolean;
    tenantId: string;
    tenant: Tenant;
    customerMembers: CustomerSegmentMember[];
}
