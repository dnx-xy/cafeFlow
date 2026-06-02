import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { QrCode } from '../entities/qr-code.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
  ) {}

  async create(tableData: Partial<Table>, tenantId: string, outletId: string): Promise<Table> {
    const table = this.tablesRepository.create({
      ...tableData,
      tenantId,
      outletId,
    });
    
    const savedTable = await this.tablesRepository.save(table);
    
    // Generate QR code for the table
    const qrCode = this.qrCodesRepository.create({
      code: `cf-${tenantId.substring(0, 6)}-${savedTable.number.toLowerCase()}`,
      tableId: savedTable.id,
      businessId: savedTable.outletId, // This should be businessId, but we don't have it here
    });
    
    await this.qrCodesRepository.save(qrCode);
    
    return await this.findOne(savedTable.id, tenantId);
  }

  async findAll(tenantId: string, outletId?: string): Promise<Table[]> {
    const where: any = { tenantId };
    if (outletId) {
      where.outletId = outletId;
    }
    return await this.tablesRepository.find({ where });
  }

  async findOne(id: string, tenantId: string): Promise<Table> {
    return await this.tablesRepository.findOne({
      where: { id, tenantId },
      relations: { qrCode: true },
    });
  }

  async update(id: string, updateTableDto: Partial<Table>, tenantId: string): Promise<Table> {
    await this.tablesRepository.update(
      { id, tenantId },
      updateTableDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.tablesRepository.delete({ id, tenantId });
  }

  async getCountByOutlet(outletId: string, tenantId: string): Promise<{ count: number, active: number, inactive: number }> {
    const [result, count] = await Promise.all([
      this.tablesRepository.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN active = false THEN 1 ELSE 0 END) as inactive
        FROM tables t
        WHERE t.outletId = $1 AND t.tenantId = $2
      `, [outletId, tenantId]),
      this.tablesRepository.count({
        where: { outletId, tenantId }
      })
    ]);

    return {
      count: count,
      active: parseInt(result[0].active) || 0,
      inactive: parseInt(result[0].inactive) || 0
    };
  }
}