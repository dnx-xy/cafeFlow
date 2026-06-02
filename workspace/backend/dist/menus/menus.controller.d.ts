import { MenusService } from './menus.service';
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
}
