import { BaseEntity } from './base.entity';
import { MenuOption } from './menu-option.entity';
export declare class MenuOptionValue extends BaseEntity {
    name: string;
    description: string;
    priceAdjustment: number;
    available: boolean;
    menuOptionId: string;
    tenantId: string;
    menuOption: MenuOption;
}
