import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { TablesService } from './tables.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    const { tableNumber, isActive, ...rest } = body;
    const tableData: any = {
      ...rest,
      number: tableNumber,
      active: isActive,
    };

    const table = await this.tablesService.create(
      tableData,
      user.tenantId,
      user.businessId,
      body.outletId,
    );

    return { ...table, tableNumber: table.number, isActive: table.active };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(
    @Query('outletId') outletId: string,
    @AuthenticatedUser() user: any,
  ) {
    const tables = await this.tablesService.findAll(user.tenantId, outletId);
    return tables.map((t: any) => ({ ...t, tableNumber: t.number, isActive: t.active }));
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    const table = await this.tablesService.findOne(id, user.tenantId);
    return { ...table, tableNumber: table.number, isActive: table.active };
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    const { tableNumber, isActive, ...rest } = body;
    const updateData: any = {
      ...rest,
      number: tableNumber,
      active: isActive,
    };

    const table = await this.tablesService.update(id, updateData, user.tenantId);
    return { ...table, tableNumber: table.number, isActive: table.active };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.tablesService.remove(id, user.tenantId);
    return { message: 'Table deleted successfully' };
  }

  @Get('count')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getCount(
    @Query('outletId') outletId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.tablesService.getCountByOutlet(outletId, user.tenantId);
  }
}