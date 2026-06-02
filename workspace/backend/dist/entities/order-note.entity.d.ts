import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
export declare class OrderNote extends BaseEntity {
    orderId: string;
    note: string;
    tenantId: string;
    order: Order;
}
