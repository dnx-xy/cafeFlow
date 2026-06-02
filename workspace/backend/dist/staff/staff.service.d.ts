import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { PlansService } from '../plans/plans.service';
export declare class StaffService {
    private staffRepository;
    private plansService;
    constructor(staffRepository: Repository<Staff>, plansService: PlansService);
    create(staffData: Partial<Staff>, tenantId: string, userId: string, outletId: string): Promise<Staff>;
    findAll(tenantId: string, outletId?: string): Promise<Staff[]>;
    findOne(id: string, tenantId: string): Promise<Staff>;
    update(id: string, updateStaffDto: Partial<Staff>, tenantId: string): Promise<Staff>;
    remove(id: string, tenantId: string): Promise<void>;
}
