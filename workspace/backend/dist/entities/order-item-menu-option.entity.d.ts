import { BaseEntity } from './base.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';
export declare class OrderItemMenuOption extends BaseEntity {
    optionValueId: string;
    quantity: number;
    priceAdjustment: number;
    tenantId: string;
    option: MenuOption;
    orderItem: OrderItem;
}
