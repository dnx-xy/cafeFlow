import { TenantsService } from './tenants.service';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(body: {
        name: string;
        slug: string;
    }): Promise<import("../entities/tenant.entity").Tenant>;
    findAll(): Promise<import("../entities/tenant.entity").Tenant[]>;
    getCurrentTenant(user: any): Promise<import("../entities/tenant.entity").Tenant>;
    findOne(id: string): Promise<import("../entities/tenant.entity").Tenant>;
}
