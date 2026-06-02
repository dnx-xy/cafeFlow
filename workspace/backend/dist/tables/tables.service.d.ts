import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { QrCode } from '../entities/qr-code.entity';
export declare class TablesService {
    private tablesRepository;
    private qrCodesRepository;
    constructor(tablesRepository: Repository<Table>, qrCodesRepository: Repository<QrCode>);
    create(tableData: Partial<Table>, tenantId: string, outletId: string): Promise<Table>;
    findAll(tenantId: string, outletId?: string): Promise<Table[]>;
    findOne(id: string, tenantId: string): Promise<Table>;
    update(id: string, updateTableDto: Partial<Table>, tenantId: string): Promise<Table>;
    remove(id: string, tenantId: string): Promise<void>;
    getCountByOutlet(outletId: string, tenantId: string): Promise<{
        count: number;
        active: number;
        inactive: number;
    }>;
}
