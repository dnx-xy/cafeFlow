import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Order } from './order.entity';
import { CustomerSegmentMember } from './customer-segment-member.entity';
import { PointTransaction } from './point-transaction.entity';
import { CustomerNote } from './customer-note.entity';
import { CustomerFeedback } from './customer-feedback.entity';
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare class Customer extends BaseEntity {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    dateOfBirth: Date;
    gender: Gender;
    joinDate: Date;
    lastVisit: Date;
    totalSpent: number;
    visitCount: number;
    favoriteMenuItemId: string;
    tenantId: string;
    businessId: string;
    tenant: Tenant;
    business: Business;
    orders: Order[];
    segments: CustomerSegmentMember[];
    loyaltyPoints: PointTransaction[];
    customerNotes: CustomerNote[];
    customerFeedback: CustomerFeedback[];
    user: User;
}
