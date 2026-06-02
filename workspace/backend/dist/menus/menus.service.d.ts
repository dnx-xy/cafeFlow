import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
export declare class MenusService {
    private menusRepository;
    private menuCategoriesRepository;
    private menuItemsRepository;
    constructor(menusRepository: Repository<Menu>, menuCategoriesRepository: Repository<MenuCategory>, menuItemsRepository: Repository<MenuItem>);
    create(menuData: Partial<Menu>, tenantId: string, outletId: string): Promise<Menu>;
    findAll(tenantId: string, outletId?: string): Promise<Menu[]>;
    findOne(id: string, tenantId: string): Promise<Menu>;
    update(id: string, updateMenuDto: Partial<Menu>, tenantId: string): Promise<Menu>;
    remove(id: string, tenantId: string): Promise<void>;
    getMenuWithItems(id: string, tenantId: string, includeCategories?: boolean, includeItems?: boolean): Promise<Menu>;
}
