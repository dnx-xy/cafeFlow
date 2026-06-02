import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';
export declare class MenuGroup extends BaseEntity {
    name: string;
    description: string;
    sortIndex: number;
    isActive: boolean;
    menuId: string;
    tenantId: string;
    menu: Menu;
    menuItems: MenuItem[];
}
