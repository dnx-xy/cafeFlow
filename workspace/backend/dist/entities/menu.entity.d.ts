import { BaseEntity } from './base.entity';
import { Outlet } from './outlet.entity';
import { Business } from './business.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuGroup } from './menu-group.entity';
import { Promotion } from './promotion.entity';
export declare class Menu extends BaseEntity {
    name: string;
    description: string;
    isActive: boolean;
    outletId: string;
    tenantId: string;
    businessId: string;
    business: Business;
    outlet: Outlet;
    categories: MenuCategory[];
    menuGroups: MenuGroup[];
    promotions: Promotion[];
}
