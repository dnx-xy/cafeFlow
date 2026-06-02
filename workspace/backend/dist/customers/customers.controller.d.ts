import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(body: any, user: any): Promise<import("../entities/customer.entity").Customer>;
    findAll(user: any): Promise<{
        data: import("../entities/customer.entity").Customer[];
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getProfile(user: any): Promise<import("../entities/customer.entity").Customer>;
    findOne(id: string, user: any): Promise<import("../entities/customer.entity").Customer>;
    updateProfile(body: any, user: any): Promise<import("../entities/customer.entity").Customer>;
    update(id: string, body: any, user: any): Promise<import("../entities/customer.entity").Customer>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
