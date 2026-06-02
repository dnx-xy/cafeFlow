import { TablesService } from './tables.service';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(body: any, user: any): Promise<{
        tableNumber: string;
        isActive: boolean;
        number: string;
        name: string;
        outletId: string;
        capacity: number;
        active: boolean;
        tenantId: string;
        outlet: import("../entities/outlet.entity").Outlet;
        orders: import("../entities/order.entity").Order[];
        qrCodes: import("../entities/qr-code.entity").QrCode[];
        qrCode: import("../entities/qr-code.entity").QrCode;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(outletId: string, user: any): Promise<any[]>;
    findOne(id: string, user: any): Promise<{
        tableNumber: string;
        isActive: boolean;
        number: string;
        name: string;
        outletId: string;
        capacity: number;
        active: boolean;
        tenantId: string;
        outlet: import("../entities/outlet.entity").Outlet;
        orders: import("../entities/order.entity").Order[];
        qrCodes: import("../entities/qr-code.entity").QrCode[];
        qrCode: import("../entities/qr-code.entity").QrCode;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, body: any, user: any): Promise<{
        tableNumber: string;
        isActive: boolean;
        number: string;
        name: string;
        outletId: string;
        capacity: number;
        active: boolean;
        tenantId: string;
        outlet: import("../entities/outlet.entity").Outlet;
        orders: import("../entities/order.entity").Order[];
        qrCodes: import("../entities/qr-code.entity").QrCode[];
        qrCode: import("../entities/qr-code.entity").QrCode;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    getCount(outletId: string, user: any): Promise<{
        count: number;
        active: number;
        inactive: number;
    }>;
}
