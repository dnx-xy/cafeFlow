import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
export declare class TenantsService {
    private tenantsRepository;
    constructor(tenantsRepository: Repository<Tenant>);
    create(name: string, slug: string): Promise<Tenant>;
    findOneById(id: string): Promise<Tenant>;
    findOneBySlug(slug: string): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
}
