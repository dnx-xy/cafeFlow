import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { User, UserRole } from '../entities/user.entity';
import { QrCode } from '../entities/qr-code.entity';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(QrCode)
    private qrCodesRepository: Repository<QrCode>,
    private qrCodesService: QrCodesService,
  ) {}

  async create(name: string, slug: string): Promise<Tenant> {
    const tenant = this.tenantsRepository.create({
      name,
      slug,
    });
    return await this.tenantsRepository.save(tenant);
  }

  async createRealTenant(data: {
    name: string;
    slug: string;
    email: string;
    password: string;
    businessName?: string;
  }): Promise<{
    tenant: Tenant;
    business: Business;
    user: User;
  }> {
    const tenant = this.tenantsRepository.create({
      name: data.name,
      slug: data.slug,
      type: 'real',
    });
    const savedTenant = await this.tenantsRepository.save(tenant);

    const business = this.businessesRepository.create({
      name: data.businessName || data.name,
      tenantId: savedTenant.id,
      ownerId: '',
    });
    const savedBusiness = await this.businessesRepository.save(business);

    const outlet = this.outletsRepository.create({
      name: 'Main Outlet',
      businessId: savedBusiness.id,
      tenantId: savedTenant.id,
    });
    await this.outletsRepository.save(outlet);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      tenantId: savedTenant.id,
      businessId: savedBusiness.id,
      role: UserRole.TENANT_OWNER,
      isActive: true,
    });
    const savedUser = await this.usersRepository.save(user);

    savedBusiness.ownerId = savedUser.id;
    await this.businessesRepository.save(savedBusiness);

    return { tenant: savedTenant, business: savedBusiness, user: savedUser };
  }

  async createQuickTenant(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    tenant: Tenant;
    business: Business;
    user: User;
    qrCode: any;
  }> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 50);

    const tenant = this.tenantsRepository.create({
      name: data.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      type: 'quick',
    });
    const savedTenant = await this.tenantsRepository.save(tenant);

    const business = this.businessesRepository.create({
      name: data.name,
      tenantId: savedTenant.id,
      ownerId: '',
    });
    const savedBusiness = await this.businessesRepository.save(business);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      tenantId: savedTenant.id,
      businessId: savedBusiness.id,
      role: UserRole.TENANT_OWNER,
      isActive: true,
    });
    const savedUser = await this.usersRepository.save(user);

    savedBusiness.ownerId = savedUser.id;
    await this.businessesRepository.save(savedBusiness);

    const qrCode = await this.qrCodesService.generateBusinessQrCode(
      savedBusiness.id,
      savedTenant.id,
    );

    return { tenant: savedTenant, business: savedBusiness, user: savedUser, qrCode };
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

  async findAll(): Promise<any[]> {
    const tenants = await this.tenantsRepository.find();
    const result = [];

    for (const tenant of tenants) {
      const item: any = {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        type: tenant.type || 'real',
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      };

      try {
        const business = await this.businessesRepository.findOne({
          where: { tenantId: tenant.id },
        });
        if (business) {
          item.businessId = business.id;
          item.logoUrl = business.logoUrl;
          if (item.type === 'quick') {
            const qrCode = await this.qrCodesRepository.findOne({
              where: { businessId: business.id, tableId: null },
              order: { createdAt: 'DESC' },
            });
            if (qrCode) {
              item.qrCode = { code: qrCode.code, id: qrCode.id };
            }
          }
        }
      } catch {
        // Silently skip business/Qr lookup errors
      }
      result.push(item);
    }

    return result;
  }
}