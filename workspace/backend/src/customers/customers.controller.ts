import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.customersService.create(
      body,
      user.tenantId,
    );
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async findAll(
    @AuthenticatedUser() user: any,
  ) {
    const data = await this.customersService.findAll(user.tenantId);
    return { data, pagination: { total: data.length, page: 1, limit: data.length } };
  }

  @Get('me')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async getProfile(
    @AuthenticatedUser() user: any,
  ) {
    return await this.customersService.getCustomerProfile(user.id, user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.customersService.findOne(id, user.tenantId);
  }

  @Put('me')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async updateProfile(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.customersService.update(
      user.id,
      body,
      user.tenantId,
    );
  }

  @Put(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.customersService.update(
      id,
      body,
      user.tenantId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.customersService.remove(id, user.tenantId);
    return { message: 'Customer deleted successfully' };
  }
}