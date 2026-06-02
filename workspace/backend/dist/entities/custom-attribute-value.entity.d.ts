import { BaseEntity } from './base.entity';
import { CustomAttribute } from './custom-attribute.entity';
import { OrderItem } from './order-item.entity';
export declare class CustomAttributeValue extends BaseEntity {
    attributeId: string;
    value: string;
    orderItemId: string;
    tenantId: string;
    attribute: CustomAttribute;
    orderItem: OrderItem;
}
