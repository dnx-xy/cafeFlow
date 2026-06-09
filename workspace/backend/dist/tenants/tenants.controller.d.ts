import { TenantsService } from './tenants.service';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(body: {
        name: string;
        slug: string;
    }): Promise<import("../entities/tenant.entity").Tenant>;
    createRealTenant(body: {
        name: string;
        slug: string;
        email: string;
        password: string;
        businessName?: string;
    }): Promise<{
        tenant: import("../entities/tenant.entity").Tenant;
        business: import("../entities/business.entity").Business;
        user: import("../entities/user.entity").User;
    }>;
    createQuickTenant(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        tenant: import("../entities/tenant.entity").Tenant;
        business: import("../entities/business.entity").Business;
        user: import("../entities/user.entity").User;
        qrCode: any;
    }>;
    findAll(): Promise<any[]>;
    getCurrentTenant(user: any): Promise<import("../entities/tenant.entity").Tenant>;
    findOne(id: string): Promise<import("../entities/tenant.entity").Tenant>;
}
