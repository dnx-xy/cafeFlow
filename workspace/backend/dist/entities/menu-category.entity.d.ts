import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';
export declare class MenuCategory extends BaseEntity {
    name: string;
    description: string;
    iconUrl: string;
    sortIndex: number;
    isActive: boolean;
    menuId: string;
    tenantId: string;
    menu: Menu;
    menuItems: MenuItem[];
}
