import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('programs')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getLoyaltyProgram(
    @AuthenticatedUser() user: any,
  ) {
    return await this.loyaltyService.getLoyaltyProgram(user.tenantId, user.businessId);
  }

  @Post('transactions')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async createPointsTransaction(
    @Body() body: any,
    @AuthenticatedUser() user: any,
  ) {
    return await this.loyaltyService.createPointsTransaction(
      body,
      user.tenantId,
    );
  }

  @Get('points/:customerId')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF)
  async getCustomerPoints(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @AuthenticatedUser() user: any,
  ) {
    return {
      points: await this.loyaltyService.getCustomerPoints(user.tenantId, customerId),
    };
  }
}