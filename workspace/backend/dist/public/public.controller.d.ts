import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    getMenuByTable(tableId: string): Promise<{
        menu: import("../entities/menu.entity").Menu;
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
            currency: string;
            phoneNumber: string;
        };
    }>;
    getMenuItem(id: string): Promise<import("../entities/menu-item.entity").MenuItem>;
    createOrder(body: {
        tableId: string;
        items: {
            menuItemId: string;
            quantity: number;
            notes?: string;
            options?: {
                optionValueId: string;
                priceAdjustment?: number;
            }[];
        }[];
        notes?: string;
        orderType?: string;
        customerName?: string;
        customerWhatsapp?: string;
        paymentMethod?: string;
    }): Promise<{
        tableNumber: string;
        orderId: string;
        orderIdPrefix: string;
        tableId: string;
        outletId: string;
        customerId: string;
        userId: string;
        status: import("../entities/enums").OrderStatus;
        orderType: import("../entities/enums").OrderType;
        notes: string;
        totalAmount: number;
        discountAmount: number;
        taxAmount: number;
        finalAmount: number;
        currency: string;
        paymentMethod: import("../entities/enums").PaymentMethod;
        paymentStatus: import("../entities/enums").PaymentStatus;
        paymentId: string;
        deliveredAt: Date;
        completedAt: Date;
        cancelledAt: Date;
        tenantId: string;
        businessId: string;
        business: import("../entities/business.entity").Business;
        table: import("../entities/table.entity").Table;
        outlet: import("../entities/outlet.entity").Outlet;
        customer: import("../entities/customer.entity").Customer;
        user: import("../entities/user.entity").User;
        orderItems: import("../entities/order-item.entity").OrderItem[];
        orderStatusUpdates: import("../entities/order-status-update.entity").OrderStatusUpdate[];
        orderNotes: import("../entities/order-note.entity").OrderNote[];
        customerFeedback: import("../entities/customer-feedback.entity").CustomerFeedback[];
        pointTransactions: import("../entities/point-transaction.entity").PointTransaction[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    submitFeedback(body: {
        customerName?: string;
        customerWhatsapp?: string;
        rating: number;
        comment?: string;
        orderId?: string;
        tenantId: string;
        businessId?: string;
    }): Promise<import("../entities/customer-feedback.entity").CustomerFeedback>;
    joinLoyalty(body: {
        name: string;
        whatsappNumber: string;
        tenantId: string;
        businessId?: string;
    }): Promise<{
        customer: import("../entities/customer.entity").Customer;
        message: string;
    }>;
}
