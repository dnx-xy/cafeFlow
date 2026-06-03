import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PaymentsService } from '../payments/payments.service';
import { IS_PUBLIC_KEY, SKIP_SUBSCRIPTION_KEY } from './decorators/auth.decorators';

@Injectable()
export class SubscriptionGuard {
  constructor(
    private reflector: Reflector,
    private paymentsService: PaymentsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const skipSubscription = this.reflector.getAllAndOverride<boolean>(SKIP_SUBSCRIPTION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipSubscription) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.businessId) return true;

    try {
      await this.paymentsService.checkActiveSubscription(user.businessId);
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
    }
    return true;
  }
}