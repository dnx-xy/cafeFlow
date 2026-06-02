import { BaseEntity } from './base.entity';
import { Outlet } from './outlet.entity';
import { Order } from './order.entity';
import { QrCode } from './qr-code.entity';
export declare class Table extends BaseEntity {
    number: string;
    name: string;
    outletId: string;
    tenantId: string;
    outlet: Outlet;
    orders: Order[];
    qrCodes: QrCode[];
    qrCode: QrCode;
}
