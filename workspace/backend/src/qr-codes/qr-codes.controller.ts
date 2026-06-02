import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { QrCodesService } from './qr-codes.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('qr-codes')
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @Post('generate')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async generateQrCode(
    @AuthenticatedUser() user: any,
    @Body() body: { tableId: string },
  ) {
    return await this.qrCodesService.generateQrCode(body.tableId, user.tenantId);
  }

  @Get('table/:tableId')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async getQrCodeByTable(
    @Param('tableId', ParseUUIDPipe) tableId: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.qrCodesService.getQrCodeByTable(tableId, user.tenantId);
  }

  @Get('scan/:code')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async scanQrCode(
    @Param('code') code: string,
    @AuthenticatedUser() user: any,
  ) {
    return await this.qrCodesService.scanQrCode(code, user.businessId);
  }

  @Get('business/:businessId')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getQrCodesByBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('active') active?: boolean,
    @AuthenticatedUser() user: any,
  ) {
    return await this.qrCodesService.getQrCodesByBusiness(businessId, active);
  }
}