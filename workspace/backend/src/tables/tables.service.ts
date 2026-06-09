import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { Outlet } from '../entities/outlet.entity';
import { QrCode } from '../entities/qr-code.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
  ) {}

  async create(tableData: Partial<Table>, tenantId: string, businessId: string, outletId?: string): Promise<Table> {
    if (!outletId) {
      let outlet = await this.outletsRepository.findOne({ where: { businessId }, order: { createdAt: 'ASC' } });
      if (!outlet) {
        outlet = this.outletsRepository.create({
          name: 'Main Outlet',
          businessId,
          tenantId,
        });
        outlet = await this.outletsRepository.save(outlet);
      }
      outletId = outlet.id;
    }
    
    if (!tableData.number) {
      tableData.number = `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
    
    const table = this.tablesRepository.create({
      ...tableData,
      tenantId,
      outletId,
    });
    
    const savedTable = await this.tablesRepository.save(table);
    
    const qrCode = this.qrCodesRepository.create({
      code: `cf-${tenantId.substring(0, 6)}-${savedTable.id.substring(0, 8)}`,
      tableId: savedTable.id,
      businessId,
      isActive: true,
    });
    
    await this.qrCodesRepository.save(qrCode);
    
    return await this.findOne(savedTable.id, tenantId);
  }

  async findAll(tenantId: string, outletId?: string): Promise<Table[]> {
    const where: any = { tenantId };
    if (outletId) {
      where.outletId = outletId;
    }
    return await this.tablesRepository.find({ where, relations: { qrCodes: true } });
  }

  async findOne(id: string, tenantId: string): Promise<Table> {
    return await this.tablesRepository.findOne({
      where: { id, tenantId },
      relations: { qrCodes: true },
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