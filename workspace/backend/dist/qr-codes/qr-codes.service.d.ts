import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';
export declare class QrCodesService {
    private qrCodesRepository;
    private tablesRepository;
    constructor(qrCodesRepository: Repository<QrCode>, tablesRepository: Repository<Table>);
    generateQrCode(tableId: string, tenantId: string): Promise<QrCode>;
    getQrCodeByTable(tableId: string, tenantId: string): Promise<QrCode | null>;
    scanQrCode(code: string, tenantId: string): Promise<QrCode>;
    getQrCodesByBusiness(businessId: string, active?: boolean): Promise<QrCode[]>;
}
