import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.outletsService.create(
      body,
      user.tenantId,
      user.businessId,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(
    @Query('businessId') businessId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.outletsService.findAll(user.tenantId, businessId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.outletsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.outletsService.update(
      id,
      body,
      user.tenantId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.outletsService.remove(id, user.tenantId);
    return { message: 'Outlet deleted successfully' };
  }
}