import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    @InjectRepository(MenuCategory)
    private menuCategoriesRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) {}

  async create(menuData: Partial<Menu>, tenantId: string, outletId: string): Promise<Menu> {
    const menu = this.menusRepository.create({
      ...menuData,
      tenantId,
      outletId,
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
    const options: any = {
      where: { id, tenantId },
    };

    if (includeCategories || includeItems) {
      options.relations = {};
      if (includeCategories) {
        options.relations.categories = true;
      }
      if (includeItems) {
        options.relations['categories.menuItems'] = true;
      }
    }

    return await this.menusRepository.findOne(options);
  }
}