import { TablesService } from './tables.service';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(body: any, user: any): Promise<import("../entities/table.entity").Table>;
    findAll(outletId: string, user: any): Promise<import("../entities/table.entity").Table[]>;
    findOne(id: string, user: any): Promise<import("../entities/table.entity").Table>;
    update(id: string, body: any, user: any): Promise<import("../entities/table.entity").Table>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getCount(outletId: string, user: any): Promise<{
        count: number;
        active: number;
        inactive: number;
    }>;
}
