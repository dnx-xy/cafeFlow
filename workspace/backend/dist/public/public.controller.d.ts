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
    }): Promise<import("../entities/order.entity").Order>;
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
