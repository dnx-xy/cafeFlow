import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { User } from '../entities/user.entity';
import { QrCode } from '../entities/qr-code.entity';
import { QrCodesService } from '../qr-codes/qr-codes.service';
export declare class TenantsService {
    private tenantsRepository;
    private businessesRepository;
    private outletsRepository;
    private usersRepository;
    private qrCodesRepository;
    private qrCodesService;
    constructor(tenantsRepository: Repository<Tenant>, businessesRepository: Repository<Business>, outletsRepository: Repository<Outlet>, usersRepository: Repository<User>, qrCodesRepository: Repository<QrCode>, qrCodesService: QrCodesService);
    create(name: string, slug: string): Promise<Tenant>;
    createRealTenant(data: {
        name: string;
        slug: string;
        email: string;
        password: string;
        businessName?: string;
    }): Promise<{
        tenant: Tenant;
        business: Business;
        user: User;
    }>;
    createQuickTenant(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        tenant: Tenant;
        business: Business;
        user: User;
        qrCode: any;
    }>;
    findOneById(id: string): Promise<Tenant>;
    findOneBySlug(slug: string): Promise<Tenant>;
    findAll(): Promise<any[]>;
}
