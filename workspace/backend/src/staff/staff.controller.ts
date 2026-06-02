import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.staffService.create(
      body,
      user.tenantId,
      user.id,
      body.outletId,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(
    @AuthenticatedUser() user: any,
  ) {
    return await this.staffService.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.staffService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.staffService.update(
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
    await this.staffService.remove(id, user.tenantId);
    return { message: 'Staff member deleted successfully' };
  }
}