import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';
export declare class QrCodesService {
    private qrCodesRepository;
    private tablesRepository;
    constructor(qrCodesRepository: Repository<QrCode>, tablesRepository: Repository<Table>);
    generateQrCode(tableId: string, businessId: string): Promise<QrCode>;
    generateBusinessQrCode(businessId: string, tenantId: string): Promise<QrCode>;
    getQrCodeByTable(tableId: string, businessId: string): Promise<QrCode | null>;
    scanQrCode(code: string): Promise<{
        tableId: string | null;
        code: string;
        outletId?: string;
        tenantId: string;
        businessId: string;
    }>;
    getQrCodesByBusiness(businessId: string, active?: boolean): Promise<QrCode[]>;
}
