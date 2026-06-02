import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { MenuGateway } from './menu.gateway';
import { PlansService } from '../plans/plans.service';
export declare class MenusService {
    private menusRepository;
    private menuCategoriesRepository;
    private menuItemsRepository;
    private outletsRepository;
    private menuGateway;
    private plansService;
    constructor(menusRepository: Repository<Menu>, menuCategoriesRepository: Repository<MenuCategory>, menuItemsRepository: Repository<MenuItem>, outletsRepository: Repository<Outlet>, menuGateway: MenuGateway, plansService: PlansService);
    create(menuData: Partial<Menu>, tenantId: string, outletId: string | undefined, businessId: string): Promise<Menu>;
    findAll(tenantId: string, outletId?: string): Promise<Menu[]>;
    findOne(id: string, tenantId: string): Promise<Menu>;
    update(id: string, updateMenuDto: Partial<Menu>, tenantId: string): Promise<Menu>;
    remove(id: string, tenantId: string): Promise<void>;
    getMenuWithItems(id: string, tenantId: string, includeCategories?: boolean, includeItems?: boolean): Promise<Menu>;
    createCategory(menuId: string, data: Partial<MenuCategory>, tenantId: string): Promise<MenuCategory>;
    updateCategory(id: string, data: Partial<MenuCategory>, tenantId: string): Promise<MenuCategory>;
    removeCategory(id: string, tenantId: string): Promise<void>;
    createItem(menuId: string, data: Partial<MenuItem>, tenantId: string, businessId?: string): Promise<MenuItem>;
    updateItem(id: string, data: Partial<MenuItem>, tenantId: string): Promise<MenuItem>;
    removeItem(id: string, tenantId: string): Promise<void>;
}
