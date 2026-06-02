import { OutletsService } from './outlets.service';
export declare class OutletsController {
    private readonly outletsService;
    constructor(outletsService: OutletsService);
    create(body: any, user: any): Promise<import("../entities/outlet.entity").Outlet>;
    findAll(businessId: string, user: any): Promise<import("../entities/outlet.entity").Outlet[]>;
    findOne(id: string, user: any): Promise<import("../entities/outlet.entity").Outlet>;
    update(id: string, body: any, user: any): Promise<import("../entities/outlet.entity").Outlet>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
