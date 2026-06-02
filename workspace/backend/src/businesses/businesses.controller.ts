import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @AuthenticatedUser() user: any,
  ) {
    return await this.businessesService.create(
      createBusinessDto,
      user.tenantId,
      user.id,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findAll(@AuthenticatedUser() user: any) {
    return await this.businessesService.findAll(user.tenantId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.businessesService.findOne(id, user.tenantId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusinessDto: Partial<CreateBusinessDto>,
    @AuthenticatedUser() user: any,
  ) {
    return await this.businessesService.update(
      id,
      updateBusinessDto,
      user.tenantId,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthenticatedUser() user: any,
  ) {
    await this.businessesService.remove(id, user.tenantId);
    return { message: 'Business deleted successfully' };
  }
}