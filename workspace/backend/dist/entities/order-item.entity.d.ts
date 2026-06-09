import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';
import { CustomAttributeValue } from './custom-attribute-value.entity';
import { OrderItemMenuOption } from './order-item-menu-option.entity';
export declare class OrderItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes: string;
    tenantId: string;
    menuItem: MenuItem;
    order: Order;
    customAttributes: CustomAttributeValue[];
    menuOptions: OrderItemMenuOption[];
}
