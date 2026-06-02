import { BaseEntity } from './base.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';
export declare class OrderItemMenuOption extends BaseEntity {
    optionId: string;
    optionValueId: string;
    quantity: number;
    priceAdjustment: number;
    orderItemId: string;
    tenantId: string;
    option: MenuOption;
    orderItem: OrderItem;
}
