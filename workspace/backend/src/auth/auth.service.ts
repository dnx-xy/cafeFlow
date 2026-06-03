import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    @InjectRepository(Outlet)
    private outletsRepository: Repository<Outlet>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
      tenantId: user.tenantId,
      businessId: user.businessId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expires_in: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        businessId: user.businessId,
      }
    };
  }

  // Public method to sign tokens from controller
  signToken(payload: any, expiresIn?: string): string {
    if (expiresIn) {
      return this.jwtService.sign(payload, { expiresIn });
    }
    return this.jwtService.sign(payload);
  }

  async register(userData: Partial<User> & { businessName?: string }) {
    const saltRounds = 10;
    const rawPassword = (userData as any).password || userData.passwordHash || '';
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const slug = (userData.businessName || 'cafe')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tenant = this.tenantsRepository.create({
      name: userData.businessName || 'My Cafe',
      slug,
    });
    const savedTenant = await this.tenantsRepository.save(tenant);

    const business = this.businessesRepository.create({
      name: userData.businessName || 'My Cafe',
      tenantId: savedTenant.id,
      ownerId: '', // will update after user creation
    });
    const savedBusiness = await this.businessesRepository.save(business);

    const outlet = this.outletsRepository.create({
      name: 'Main Outlet',
      businessId: savedBusiness.id,
      tenantId: savedTenant.id,
    });
    await this.outletsRepository.save(outlet);

    const userInput: Partial<User> = {
      name: userData.name || '',
      email: userData.email || '',
      passwordHash: hashedPassword,
      tenantId: savedTenant.id,
      businessId: savedBusiness.id,
      role: UserRole.TENANT_OWNER,
      isActive: true,
    };

    const user = this.usersRepository.create(userInput);
    const savedUser = await this.usersRepository.save(user);

    savedBusiness.ownerId = savedUser.id;
    await this.businessesRepository.save(savedBusiness);

    return savedUser;
  }

  async findTenantById(id: string): Promise<Tenant | null> {
    return await this.tenantsRepository.findOne({ where: { id } });
  }

  async findBusinessByTenantId(tenantId: string): Promise<Business | null> {
    return await this.businessesRepository.findOne({ where: { tenantId } });
  }
}