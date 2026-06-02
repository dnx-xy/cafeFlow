import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private plansService: PlansService,
  ) {}

  async create(staffData: Partial<Staff>, tenantId: string, userId: string, outletId: string): Promise<Staff> {
    await this.plansService.enforceStaffLimit(tenantId);
    const staff = this.staffRepository.create({
      ...staffData,
      tenantId,
      userId,
      outletId,
    });
    return await this.staffRepository.save(staff);
  }

  async findAll(tenantId: string, outletId?: string): Promise<Staff[]> {
    const where: any = { tenantId };
    if (outletId) {
      where.outletId = outletId;
    }
    return await this.staffRepository.find({
      where,
      relations: { user: true },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Staff> {
    return await this.staffRepository.findOne({
      where: { id, tenantId },
      relations: { user: true, outlet: true },
    });
  }

  async update(id: string, updateStaffDto: Partial<Staff>, tenantId: string): Promise<Staff> {
    await this.staffRepository.update(
      { id, tenantId },
      updateStaffDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.staffRepository.delete({ id, tenantId });
  }
}