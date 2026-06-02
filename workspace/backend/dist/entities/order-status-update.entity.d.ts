import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { OrderStatus } from './enums';
export declare class OrderStatusUpdate extends BaseEntity {
    orderId: string;
    status: OrderStatus;
    changedBy: string;
    tenantId: string;
    order: Order;
}
