import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Outlet } from './outlet.entity';
import { User } from './user.entity';
import { Menu } from './menu.entity';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { LoyaltyProgram } from './loyalty-program.entity';
import { QrCode } from './qr-code.entity';
export declare class Business extends BaseEntity {
    name: string;
    description: string;
    logoUrl: string;
    address: string;
    city: string;
    countryCode: string;
    plan: string;
    currency: string;
    ownerId: string;
    tenantId: string;
    tenant: Tenant;
    outlets: Outlet[];
    users: User[];
    menus: Menu[];
    orders: Order[];
    customers: Customer[];
    loyaltyPrograms: LoyaltyProgram[];
    qrCodes: QrCode[];
}
