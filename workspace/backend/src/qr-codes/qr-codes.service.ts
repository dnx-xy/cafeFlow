import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';
import { Outlet } from '../entities/outlet.entity';
import * as crypto from 'crypto';

@Injectable()
export class QrCodesService {
  constructor(
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async generateQrCode(tableId: string, businessId: string): Promise<QrCode> {
    // Check if table exists and belongs to business
    const table = await this.tablesRepository.findOne({
      where: { id: tableId },
    });

    if (!table) {
      throw new Error('Table not found or does not belong to business');
    }

    // Generate unique QR code
    const code = crypto.randomBytes(16).toString('hex');

    // Create QR code
    const qrCode = this.qrCodesRepository.create({
      code,
      tableId,
      businessId,
      isActive: true,
    });

    return await this.qrCodesRepository.save(qrCode);
  }

  async generateBusinessQrCode(businessId: string, tenantId: string): Promise<QrCode> {
    const code = crypto.randomBytes(16).toString('hex');

    const qrCode = this.qrCodesRepository.create({
      code,
      tableId: null,
      businessId,
      tenantId,
      isActive: true,
    });

    return await this.qrCodesRepository.save(qrCode);
  }

  async getQrCodeByTable(tableId: string, businessId: string): Promise<QrCode | null> {
    return await this.qrCodesRepository.findOne({
      where: { tableId, businessId },
      order: { createdAt: 'DESC' },
    });
  }

  async scanQrCode(code: string): Promise<{ tableId: string | null; code: string; outletId?: string; tenantId: string; businessId: string }> {
    const qrCode = await this.qrCodesRepository.findOne({
      where: { code, isActive: true },
    });

    if (!qrCode) {
      throw new Error('Invalid or inactive QR code');
    }

    qrCode.scannedAt = new Date();
    await this.qrCodesRepository.save(qrCode);

    // Business-level QR code (no table)
    if (!qrCode.tableId) {
      return {
        tableId: null,
        code: qrCode.code,
        outletId: undefined,
        tenantId: qrCode.tenantId || '',
        businessId: qrCode.businessId,
      };
    }

    const table = await this.tablesRepository.findOne({
      where: { id: qrCode.tableId },
      relations: { outlet: { business: true } },
    });

    if (!table) {
      throw new Error('Table not found');
    }

    return {
      tableId: qrCode.tableId,
      code: qrCode.code,
      outletId: table.outletId,
      tenantId: table.tenantId,
      businessId: table.outlet?.businessId || '',
    };
  }

  async getQrCodesByBusiness(businessId: string, active?: boolean): Promise<QrCode[]> {
    const where: any = { businessId };
    if (active !== undefined) {
      where.isActive = active;
    }

    return await this.qrCodesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}