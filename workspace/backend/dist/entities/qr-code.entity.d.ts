import { BaseEntity } from './base.entity';
import { Table } from './table.entity';
export declare class QrCode extends BaseEntity {
    code: string;
    tableId: string;
    tenantId: string;
    active: boolean;
    usageCount: number;
    table: Table;
}
