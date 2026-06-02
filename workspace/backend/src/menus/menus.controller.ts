import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.create(
      body,
      user.tenantId,
      user.businessId,
    );
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(
    @Query('outletId') outletId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.findAll(user.tenantId, outletId);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.findOne(id, user.tenantId);
  }

  @Get(':id/items')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getMenuWithItems(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include: string,
    @AuthenticatedUser() user: any,
  ) {
    const includeCategories = include?.includes('categories');
    const includeItems = include?.includes('items');
    return await this.menusService.getMenuWithItems(id, user.tenantId, includeCategories, includeItems);
  }

  @Put(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.update(
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
    await this.menusService.remove(id, user.tenantId);
    return { message: 'Menu deleted successfully' };
  }
}