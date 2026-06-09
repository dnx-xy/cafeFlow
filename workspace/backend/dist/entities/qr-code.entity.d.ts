import { BaseEntity } from './base.entity';
import { Table } from './table.entity';
import { Business } from './business.entity';
export declare class QrCode extends BaseEntity {
    code: string;
    tableId: string;
    businessId: string;
    tenantId: string;
    scannedAt: Date;
    isActive: boolean;
    table: Table;
    business: Business;
}
