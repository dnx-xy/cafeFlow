import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.create(
      body,
      user.tenantId,
      body.outletId,
      user.businessId,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(
    @Query('outletId') outletId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.findAll(user.tenantId, outletId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.findOne(id, user.tenantId);
  }

  @Get(':id/items')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
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
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.menusService.remove(id, user.tenantId);
    return { message: 'Menu deleted successfully' };
  }

  // --- Categories ---

  @Post(':menuId/categories')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async createCategory(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() body: Partial<MenuCategory>,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.createCategory(menuId, body, user.tenantId);
  }

  @Put('categories/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<MenuCategory>,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.updateCategory(id, body, user.tenantId);
  }

  @Delete('categories/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async removeCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.menusService.removeCategory(id, user.tenantId);
    return { message: 'Category deleted successfully' };
  }

  // --- Menu Items ---

  @Post(':menuId/items')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async createItem(
    @Param('menuId', ParseUUIDPipe) menuId: string,
    @Body() body: Partial<MenuItem>,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.createItem(menuId, body, user.tenantId, user.businessId);
  }

  @Put('items/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Partial<MenuItem>,
    @AuthenticatedUser() user: any,
  ) {
    return await this.menusService.updateItem(id, body, user.tenantId);
  }

  @Delete('items/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.menusService.removeItem(id, user.tenantId);
    return { message: 'Item deleted successfully' };
  }
}