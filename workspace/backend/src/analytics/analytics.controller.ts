import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthenticatedUser, Roles } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getAnalytics(
    @Query('period') period: 'week' | 'month' | 'year',
    @AuthenticatedUser() user: any,
  ) {
    return await this.analyticsService.getAnalytics(user.tenantId, period || 'week');
  }

  @Get('kpi')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getKpiSummary(@AuthenticatedUser() user: any) {
    return await this.analyticsService.getKpiSummary(user.tenantId);
  }
}