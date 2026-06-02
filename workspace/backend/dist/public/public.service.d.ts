import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { Table } from '../entities/table.entity';
import { Business } from '../entities/business.entity';
import { Order } from '../entities/order.entity';
import { OrderItem as OrderItemEntity } from '../entities/order-item.entity';
import { Customer } from '../entities/customer.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
export declare class PublicService {
    private menusRepository;
    private menuItemsRepository;
    private outletsRepository;
    private tablesRepository;
    private businessesRepository;
    private ordersRepository;
    private orderItemsRepository;
    private customersRepository;
    private feedbackRepository;
    private loyaltyProgramsRepository;
    private pointTransactionsRepository;
    constructor(menusRepository: Repository<Menu>, menuItemsRepository: Repository<MenuItem>, outletsRepository: Repository<Outlet>, tablesRepository: Repository<Table>, businessesRepository: Repository<Business>, ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItemEntity>, customersRepository: Repository<Customer>, feedbackRepository: Repository<CustomerFeedback>, loyaltyProgramsRepository: Repository<LoyaltyProgram>, pointTransactionsRepository: Repository<PointTransaction>);
    getMenuByTable(tableId: string): Promise<{
        menu: Menu;
        cafe: {
            id: string;
            name: string;
            description: string;
            location: string;
            hours: string;
            tableNumber: string;
            logo: string;
            outletId: string;
            tenantId: string;
            businessId: string;
        };
    }>;
    createOrder(data: {
        tableId: string;
        items: {
            menuItemId: string;
            quantity: number;
            notes?: string;
        }[];
        notes?: string;
        orderType?: string;
        customerName?: string;
        customerWhatsapp?: string;
    }): Promise<Order>;
    submitFeedback(data: {
        customerName?: string;
        customerWhatsapp?: string;
        rating: number;
        comment?: string;
        orderId?: string;
        tenantId: string;
        businessId?: string;
    }): Promise<CustomerFeedback>;
    joinLoyalty(data: {
        name: string;
        whatsappNumber: string;
        tenantId: string;
        businessId?: string;
    }): Promise<{
        customer: Customer;
        message: string;
    }>;
}
