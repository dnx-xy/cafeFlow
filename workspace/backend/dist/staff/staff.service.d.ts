import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
export declare class StaffService {
    private staffRepository;
    constructor(staffRepository: Repository<Staff>);
    create(staffData: Partial<Staff>, tenantId: string, userId: string, outletId: string): Promise<Staff>;
    findAll(tenantId: string, outletId?: string): Promise<Staff[]>;
    findOne(id: string, tenantId: string): Promise<Staff>;
    update(id: string, updateStaffDto: Partial<Staff>, tenantId: string): Promise<Staff>;
    remove(id: string, tenantId: string): Promise<void>;
}
