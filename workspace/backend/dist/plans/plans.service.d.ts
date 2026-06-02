import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { Staff } from '../entities/staff.entity';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Plan, PlanLimits } from './plan.config';
export declare class PlansService {
    private businessesRepository;
    private outletsRepository;
    private staffRepository;
    private menusRepository;
    private menuItemsRepository;
    constructor(businessesRepository: Repository<Business>, outletsRepository: Repository<Outlet>, staffRepository: Repository<Staff>, menusRepository: Repository<Menu>, menuItemsRepository: Repository<MenuItem>);
    getPlan(businessId: string): Promise<Plan>;
    getLimits(businessId: string): Promise<{
        plan: Plan;
        limits: PlanLimits;
    }>;
    enforceOutletLimit(businessId: string): Promise<void>;
    enforceStaffLimit(businessId: string): Promise<void>;
    enforceMenuLimit(businessId: string): Promise<void>;
    enforceMenuItemLimit(businessId: string, menuId?: string): Promise<void>;
    getFeatureAccess(businessId: string, feature: keyof Omit<PlanLimits, 'maxOutlets' | 'maxStaff' | 'maxMenus' | 'maxMenuItems' | 'maxCategoriesPerMenu'>): Promise<boolean>;
}
