import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { MenuOptionValue } from './menu-option-value.entity';
export declare class MenuOption extends BaseEntity {
    name: string;
    description: string;
    priceAdjustment: number;
    required: boolean;
    menuItemId: string;
    tenantId: string;
    menuItem: MenuItem;
    options: MenuOptionValue[];
}
