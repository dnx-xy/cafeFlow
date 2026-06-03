import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { Staff } from '../entities/staff.entity';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Plan, PLAN_LIMITS, PlanLimits } from './plan.config';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) {}

  async getPlan(businessId: string): Promise<Plan> {
    const business = await this.businessesRepository.findOne({
      where: { id: businessId },
      select: { plan: true, subscriptionStatus: true, trialEndsAt: true },
    });
    if (!business) return Plan.FREE;
    const status = business.subscriptionStatus;
    const now = new Date();
    const trialEnd = business.trialEndsAt;
    if (status === 'inactive' || status === 'canceled') return Plan.FREE;
    if (status === 'trial' && trialEnd && trialEnd < now) return Plan.FREE;
    if (status === 'past_due') return Plan.FREE;
    return (business?.plan as Plan) || Plan.FREE;
  }

  async getLimits(businessId: string): Promise<{ plan: Plan; limits: PlanLimits }> {
    const plan = await this.getPlan(businessId);
    return { plan, limits: PLAN_LIMITS[plan] };
  }

  async enforceOutletLimit(businessId: string): Promise<void> {
    const { plan, limits } = await this.getLimits(businessId);
    if (limits.maxOutlets === -1) return;
    const count = await this.outletsRepository.count({ where: { businessId } });
    if (count >= limits.maxOutlets) {
      throw new ForbiddenException(
        `Plan ${plan} limit reached: max ${limits.maxOutlets} outlets. Upgrade your plan.`,
      );
    }
  }

  async enforceStaffLimit(businessId: string): Promise<void> {
    const { plan, limits } = await this.getLimits(businessId);
    if (limits.maxStaff === -1) return;
    const count = await this.staffRepository.count({ where: { tenantId: businessId } });
    if (count >= limits.maxStaff) {
      throw new ForbiddenException(
        `Plan ${plan} limit reached: max ${limits.maxStaff} staff members. Upgrade your plan.`,
      );
    }
  }

  async enforceMenuLimit(businessId: string): Promise<void> {
    const { plan, limits } = await this.getLimits(businessId);
    if (limits.maxMenus === -1) return;
    const count = await this.menusRepository.count({ where: { businessId } });
    if (count >= limits.maxMenus) {
      throw new ForbiddenException(
        `Plan ${plan} limit reached: max ${limits.maxMenus} menus. Upgrade your plan.`,
      );
    }
  }

  async enforceMenuItemLimit(businessId: string, menuId?: string): Promise<void> {
    const { plan, limits } = await this.getLimits(businessId);
    if (limits.maxMenuItems === -1) return;
    const where: any = {};
    if (menuId) {
      where.menuId = menuId;
    } else {
      const menus = await this.menusRepository.find({ where: { businessId }, select: { id: true } });
      where.menuId = menus.length > 0 ? menus.map(m => m.id) : 'none';
    }
    const count = await this.menuItemsRepository.count({ where });
    if (count >= limits.maxMenuItems) {
      throw new ForbiddenException(
        `Plan ${plan} limit reached: max ${limits.maxMenuItems} menu items. Upgrade your plan.`,
      );
    }
  }

  async getFeatureAccess(businessId: string, feature: keyof Omit<PlanLimits, 'maxOutlets' | 'maxStaff' | 'maxMenus' | 'maxMenuItems' | 'maxCategoriesPerMenu'>): Promise<boolean> {
    const { limits } = await this.getLimits(businessId);
    return limits[feature];
  }
}