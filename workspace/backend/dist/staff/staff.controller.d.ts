import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(body: any, user: any): Promise<import("../entities/staff.entity").Staff>;
    findAll(user: any): Promise<import("../entities/staff.entity").Staff[]>;
    findOne(id: string, user: any): Promise<import("../entities/staff.entity").Staff>;
    update(id: string, body: any, user: any): Promise<import("../entities/staff.entity").Staff>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
