import { Repository } from 'typeorm';
import { Outlet } from '../entities/outlet.entity';
export declare class OutletsService {
    private outletsRepository;
    constructor(outletsRepository: Repository<Outlet>);
    create(outletData: Partial<Outlet>, tenantId: string, businessId: string): Promise<Outlet>;
    findAll(tenantId: string, businessId?: string): Promise<Outlet[]>;
    findOne(id: string, tenantId: string): Promise<Outlet>;
    update(id: string, updateOutletDto: Partial<Outlet>, tenantId: string): Promise<Outlet>;
    remove(id: string, tenantId: string): Promise<void>;
}
