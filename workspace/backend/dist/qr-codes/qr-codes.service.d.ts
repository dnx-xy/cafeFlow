import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';
export declare class QrCodesService {
    private qrCodesRepository;
    private tablesRepository;
    constructor(qrCodesRepository: Repository<QrCode>, tablesRepository: Repository<Table>);
    generateQrCode(tableId: string, businessId: string): Promise<QrCode>;
    getQrCodeByTable(tableId: string, businessId: string): Promise<QrCode | null>;
    scanQrCode(code: string, businessId: string): Promise<QrCode>;
    getQrCodesByBusiness(businessId: string, active?: boolean): Promise<QrCode[]>;
}
