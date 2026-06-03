import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthenticatedUser, Roles, Public } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';
import { PLAN_PRICING } from '../plans/pricing.config';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('subscription')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async getSubscription(@AuthenticatedUser() user: any) {
    return await this.paymentsService.getSubscription(user.businessId);
  }

  @Post('activate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER)
  async activateSubscription(
    @Body() body: { plan: string },
    @AuthenticatedUser() user: any,
  ) {
    return await this.paymentsService.activateSubscription(user.businessId, body.plan);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivateSubscription(
    @Body() body: { businessId: string },
  ) {
    return await this.paymentsService.deactivateSubscription(body.businessId);
  }

  @Post('trial')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER)
  async startTrial(
    @Body() body: { plan: string },
    @AuthenticatedUser() user: any,
  ) {
    return await this.paymentsService.startTrial(user.businessId, body.plan);
  }

  @Post('verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER, UserRole.MANAGER)
  async verifyPayment(@AuthenticatedUser() user: any) {
    return await this.paymentsService.verifyPaymentStatus(user.tenantId);
  }

  @Post('webhook')
  @Public()
  async stripeWebhook(@Body() body: any) {
    // Stripe webhook handler - process events like invoice.paid, customer.subscription.deleted
    const event = body;
    if (event.type === 'invoice.paid') {
      const subscriptionId = event.data.object.subscription;
      const customerId = event.data.object.customer;
      // Find business by stripeCustomerId or stripeSubscriptionId and activate
    }
    if (event.type === 'customer.subscription.deleted') {
      // Deactivate subscription
    }
    return { received: true };
  }

  @Get('verify/:tenantId')
  @Roles(UserRole.SUPER_ADMIN)
  async verifyTenantPayment(@Param('tenantId') tenantId: string) {
    return await this.paymentsService.verifyPaymentStatus(tenantId);
  }

  @Get('pricing')
  @Public()
  async getPricing() {
    return PLAN_PRICING;
  }
}