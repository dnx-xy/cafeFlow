import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { Table } from './table.entity';
import { Menu } from './menu.entity';
import { Order } from './order.entity';
import { Staff } from './staff.entity';
export declare class Outlet extends BaseEntity {
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
    businessId: string;
    tenantId: string;
    business: Business;
    tables: Table[];
    menus: Menu[];
    orders: Order[];
    staffMembers: Staff[];
}
