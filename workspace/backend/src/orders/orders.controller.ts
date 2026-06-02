import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';
import { OrderStatus } from '../entities/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.ordersService.create(
      body,
      user.tenantId,
    );
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async findAll(
    @Query('outletId') outletId: string,
    @Query('status') status: string,
    @Query('orderType') orderType: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @AuthenticatedUser() user: any,
  ) {
    const data = await this.ordersService.findAll(
      user.tenantId,
      outletId,
      status,
      orderType,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return { data, pagination: { total: data.length, page: 1, limit: data.length } };
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.ordersService.findOne(id, user.tenantId);
  }

  @Put(':id/status')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string },
    @AuthenticatedUser() user: any,
  ) {
    return await this.ordersService.updateStatus(
      id,
      body.status as OrderStatus,
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
    return await this.ordersService.update(
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
    await this.ordersService.remove(id, user.tenantId);
    return { message: 'Order deleted successfully' };
  }
}