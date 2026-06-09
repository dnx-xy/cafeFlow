import { QrCodesService } from './qr-codes.service';
export declare class QrCodesController {
    private readonly qrCodesService;
    constructor(qrCodesService: QrCodesService);
    generateQrCode(user: any, body: {
        tableId: string;
    }): Promise<import("../entities/qr-code.entity").QrCode>;
    getQrCodeByTable(tableId: string, user: any): Promise<import("../entities/qr-code.entity").QrCode>;
    scanQrCode(code: string): Promise<{
        tableId: string | null;
        code: string;
        outletId?: string;
        tenantId: string;
        businessId: string;
    }>;
    generateBusinessQrCode(user: any): Promise<import("../entities/qr-code.entity").QrCode>;
    getQrCodesByBusiness(user: any, businessId: string, active?: boolean): Promise<import("../entities/qr-code.entity").QrCode[]>;
}
