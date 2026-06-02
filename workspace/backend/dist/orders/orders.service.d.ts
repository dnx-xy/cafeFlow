import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/enums';
import { OrderItem } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { Table } from '../entities/table.entity';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private customersRepository;
    private tablesRepository;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, customersRepository: Repository<Customer>, tablesRepository: Repository<Table>);
    create(orderData: Partial<Order>, tenantId: string): Promise<Order>;
    findAll(tenantId: string, outletId?: string, status?: string, orderType?: string, startDate?: Date, endDate?: Date): Promise<Order[]>;
    findOne(id: string, tenantId: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<Order>;
    update(id: string, updateOrderDto: Partial<Order>, tenantId: string): Promise<Order>;
    remove(id: string, tenantId: string): Promise<void>;
}
