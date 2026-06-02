import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { TablesService } from './tables.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    // Map frontend field names to backend entity field names
    const tableData = {
      ...body,
      number: body.tableNumber, // Convert frontend "tableNumber" to backend "number"
      outletId: user.businessId, // Use businessId as outletId for now
    };
    
    return await this.tablesService.create(
      tableData,
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
    return await this.tablesService.findAll(user.tenantId, outletId);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.tablesService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.tablesService.update(
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
    await this.tablesService.remove(id, user.tenantId);
    return { message: 'Table deleted successfully' };
  }

  @Get('count')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getCount(
    @Query('outletId') outletId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.tablesService.getCountByOutlet(outletId, user.tenantId);
  }
}