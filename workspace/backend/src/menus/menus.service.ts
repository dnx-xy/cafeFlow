import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { MenuGateway } from './menu.gateway';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private menuCategoriesRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    private menuGateway: MenuGateway,
    private plansService: PlansService,
  ) {}

  async create(menuData: Partial<Menu>, tenantId: string, outletId: string | undefined, businessId: string): Promise<Menu> {
    await this.plansService.enforceMenuLimit(businessId);
    if (!outletId) {
      let outlet = await this.outletsRepository.findOne({ where: { businessId }, order: { createdAt: 'ASC' } });
      if (!outlet) {
        outlet = this.outletsRepository.create({
          name: 'Main Outlet',
          businessId,
          tenantId,
        });
        outlet = await this.outletsRepository.save(outlet);
      }
      outletId = outlet.id;
    }
    const menu = this.menusRepository.create({
      ...menuData,
      tenantId,
      outletId,
      businessId,
    });
    return await this.menusRepository.save(menu);
  }

  async findAll(tenantId: string, outletId?: string): Promise<Menu[]> {
    const where: any = { tenantId };
    if (outletId) {
      where.outletId = outletId;
    }
    return await this.menusRepository.find({ where });
  }

  async findOne(id: string, tenantId: string): Promise<Menu> {
    return await this.menusRepository.findOne({
      where: { id, tenantId },
      relations: { categories: true, menuGroups: true, promotions: true },
    });
  }

  async update(id: string, updateMenuDto: Partial<Menu>, tenantId: string): Promise<Menu> {
    await this.menusRepository.update(
      { id, tenantId },
      updateMenuDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.menusRepository.delete({ id, tenantId });
  }

  async getMenuWithItems(id: string, tenantId: string, includeCategories: boolean = false, includeItems: boolean = false): Promise<Menu> {
    const relations: Record<string, any> = {};

    if (includeCategories || includeItems) {
      if (includeItems) {
        relations.categories = { menuItems: true };
      } else {
        relations.categories = true;
      }
    }

    return await this.menusRepository.findOne({
      where: { id, tenantId },
      relations: Object.keys(relations).length > 0 ? relations : undefined,
    });
  }

  // --- Categories ---

  async createCategory(menuId: string, data: Partial<MenuCategory>, tenantId: string): Promise<MenuCategory> {
    const category = this.menuCategoriesRepository.create({
      ...data,
      menuId,
      tenantId,
    });
    return await this.menuCategoriesRepository.save(category);
  }

  async updateCategory(id: string, data: Partial<MenuCategory>, tenantId: string): Promise<MenuCategory> {
    await this.menuCategoriesRepository.update({ id, tenantId }, data);
    return await this.menuCategoriesRepository.findOne({ where: { id, tenantId } });
  }

  async removeCategory(id: string, tenantId: string): Promise<void> {
    await this.menuCategoriesRepository.delete({ id, tenantId });
  }

  // --- Menu Items ---

  async createItem(menuId: string, data: Partial<MenuItem>, tenantId: string, businessId?: string): Promise<MenuItem> {
    if (businessId) {
      await this.plansService.enforceMenuItemLimit(businessId, menuId);
    }
    const item = this.menuItemsRepository.create({
      ...data,
      menuId,
      tenantId,
    });
    return await this.menuItemsRepository.save(item);
  }

  async updateItem(id: string, data: Partial<MenuItem>, tenantId: string): Promise<MenuItem> {
    await this.menuItemsRepository.update({ id, tenantId }, data);
    const updated = await this.menuItemsRepository.findOne({
      where: { id, tenantId },
      relations: { menu: true },
    });
    if (updated && updated.menu?.businessId) {
      this.menuGateway.emitMenuItemUpdated(updated.menu.businessId, {
        itemId: updated.id,
        soldOut: updated.soldOut,
        available: updated.available,
        updatedAt: updated.updatedAt.toISOString(),
      });
    }
    return updated;
  }

  async removeItem(id: string, tenantId: string): Promise<void> {
    await this.menuItemsRepository.delete({ id, tenantId });
  }
}
