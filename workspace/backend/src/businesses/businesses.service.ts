import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, tenantId: string, ownerId: string): Promise<Business> {
    const business = this.businessesRepository.create({
      ...createBusinessDto,
      tenantId,
      ownerId,
    });
    return await this.businessesRepository.save(business);
  }

  async findAll(tenantId: string): Promise<Business[]> {
    return await this.businessesRepository.find({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Business> {
    return await this.businessesRepository.findOne({
      where: { id, tenantId },
    });
  }

  async update(id: string, updateBusinessDto: Partial<Business>, tenantId: string): Promise<Business> {
    await this.businessesRepository.update(
      { id, tenantId },
      updateBusinessDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.businessesRepository.delete({ id, tenantId });
  }
}