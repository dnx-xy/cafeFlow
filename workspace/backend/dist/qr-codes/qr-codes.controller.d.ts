import { QrCodesService } from './qr-codes.service';
export declare class QrCodesController {
    private readonly qrCodesService;
    constructor(qrCodesService: QrCodesService);
    generateQrCode(body: {
        tableId: string;
    }, user: any): Promise<import("../entities/qr-code.entity").QrCode>;
    getQrCodeByTable(tableId: string, user: any): Promise<import("../entities/qr-code.entity").QrCode>;
    scanQrCode(code: string, user: any): Promise<import("../entities/qr-code.entity").QrCode>;
    getQrCodesByBusiness(businessId: string, active?: boolean, user: any): Promise<import("../entities/qr-code.entity").QrCode[]>;
}
