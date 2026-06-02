import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() body: { name: string; slug: string }) {
    return await this.tenantsService.create(body.name, body.slug);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll() {
    return await this.tenantsService.findAll();
  }

  @Get('current')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async getCurrentTenant(@AuthenticatedUser() user: any) {
    return await this.tenantsService.findOneById(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tenantsService.findOneById(id);
  }
}