import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Outlet } from './outlet.entity';
export declare enum StaffRoleId {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    WAITER = "WAITER",
    CHEF = "CHEF",
    CASHIER = "CASHIER"
}
export declare class Staff extends BaseEntity {
    userId: string;
    outletId: string;
    roleId: StaffRoleId;
    isActive: boolean;
    tenantId: string;
    user: User;
    outlet: Outlet;
}
