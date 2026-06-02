import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
export declare class BusinessesService {
    private businessesRepository;
    constructor(businessesRepository: Repository<Business>);
    create(createBusinessDto: CreateBusinessDto, tenantId: string, ownerId: string): Promise<Business>;
    findAll(tenantId: string): Promise<Business[]>;
    findOne(id: string, tenantId: string): Promise<Business>;
    update(id: string, updateBusinessDto: Partial<Business>, tenantId: string): Promise<Business>;
    remove(id: string, tenantId: string): Promise<void>;
}
