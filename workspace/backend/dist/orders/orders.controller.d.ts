import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(body: any, user: any): Promise<import("../entities/order.entity").Order>;
    findAll(outletId: string, status: string, orderType: string, startDate: string, endDate: string, user: any): Promise<{
        data: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(id: string, user: any): Promise<any>;
    updateStatus(id: string, body: {
        status: string;
    }, user: any): Promise<import("../entities/order.entity").Order>;
    update(id: string, body: any, user: any): Promise<import("../entities/order.entity").Order>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
