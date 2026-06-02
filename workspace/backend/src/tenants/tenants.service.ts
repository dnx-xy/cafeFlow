import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  async create(name: string, slug: string): Promise<Tenant> {
    const tenant = this.tenantsRepository.create({
      name,
      slug,
    });
    return await this.tenantsRepository.save(tenant);
  }

  async findOneById(id: string): Promise<Tenant> {
    return await this.tenantsRepository.findOne({
      where: { id },
    });
  }

  async findOneBySlug(slug: string): Promise<Tenant> {
    return await this.tenantsRepository.findOne({
      where: { slug },
    });
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantsRepository.find();
  }
}