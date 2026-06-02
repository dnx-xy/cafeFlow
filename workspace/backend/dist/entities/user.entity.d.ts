import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Business } from './business.entity';
import { Staff } from './staff.entity';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    TENANT_OWNER = "TENANT_OWNER",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
    CUSTOMER = "CUSTOMER"
}
export declare class User extends BaseEntity {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    tenantId: string;
    businessId: string;
    lastLogin: Date;
    tenant: Tenant;
    business: Business;
    staff: Staff[];
    orders: Order[];
    customer: Customer;
}
