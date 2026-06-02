import { MenusService } from './menus.service';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(body: any, user: any): Promise<import("../entities/menu.entity").Menu>;
    findAll(outletId: string, user: any): Promise<import("../entities/menu.entity").Menu[]>;
    findOne(id: string, user: any): Promise<import("../entities/menu.entity").Menu>;
    getMenuWithItems(id: string, include: string, user: any): Promise<import("../entities/menu.entity").Menu>;
    update(id: string, body: any, user: any): Promise<import("../entities/menu.entity").Menu>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    createCategory(menuId: string, body: Partial<MenuCategory>, user: any): Promise<MenuCategory>;
    updateCategory(id: string, body: Partial<MenuCategory>, user: any): Promise<MenuCategory>;
    removeCategory(id: string, user: any): Promise<{
        message: string;
    }>;
    createItem(menuId: string, body: Partial<MenuItem>, user: any): Promise<MenuItem>;
    updateItem(id: string, body: Partial<MenuItem>, user: any): Promise<MenuItem>;
    removeItem(id: string, user: any): Promise<{
        message: string;
    }>;
}
