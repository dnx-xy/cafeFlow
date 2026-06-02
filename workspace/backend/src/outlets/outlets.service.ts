import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outlet } from '../entities/outlet.entity';

@Injectable()
export class OutletsService {
  constructor(
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
  ) {}

  async create(outletData: Partial<Outlet>, tenantId: string, businessId: string): Promise<Outlet> {
    const outlet = this.outletsRepository.create({
      ...outletData,
      tenantId,
      businessId,
    });
    return await this.outletsRepository.save(outlet);
  }

  async findAll(tenantId: string, businessId?: string): Promise<Outlet[]> {
    const where: any = { tenantId };
    if (businessId) {
      where.businessId = businessId;
    }
    return await this.outletsRepository.find({ where });
  }

  async findOne(id: string, tenantId: string): Promise<Outlet> {
    return await this.outletsRepository.findOne({
      where: { id, tenantId },
    });
  }

  async update(id: string, updateOutletDto: Partial<Outlet>, tenantId: string): Promise<Outlet> {
    await this.outletsRepository.update(
      { id, tenantId },
      updateOutletDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.outletsRepository.delete({ id, tenantId });
  }
}