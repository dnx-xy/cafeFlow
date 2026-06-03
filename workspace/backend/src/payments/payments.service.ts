import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business, SubscriptionStatus } from '../entities/business.entity';
import { Plan, PLAN_LIMITS } from '../plans/plan.config';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class PaymentsService {
  private readonly TRIAL_DAYS = 14;

  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
    private plansService: PlansService,
  ) {}

  async getSubscription(businessId: string): Promise<{
    plan: string;
    subscriptionStatus: SubscriptionStatus;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
    isActive: boolean;
  }> {
    const business = await this.businessesRepository.findOne({
      where: { id: businessId },
    });
    const status = business?.subscriptionStatus || SubscriptionStatus.TRIAL;
    const now = new Date();
    const trialEnd = business?.trialEndsAt || new Date(now.getTime() + this.TRIAL_DAYS * 24 * 60 * 60 * 1000);
    let isActive = true;
    if (status === SubscriptionStatus.INACTIVE || status === SubscriptionStatus.CANCELED) {
      isActive = false;
    } else if (status === SubscriptionStatus.TRIAL && trialEnd < now) {
      isActive = false;
    } else if (status === SubscriptionStatus.PAST_DUE) {
      isActive = false;
    }
    return {
      plan: business?.plan || Plan.FREE,
      subscriptionStatus: status,
      trialEndsAt: trialEnd,
      currentPeriodEnd: business?.currentPeriodEnd || null,
      isActive,
    };
  }

  async checkActiveSubscription(businessId: string): Promise<void> {
    const sub = await this.getSubscription(businessId);
    if (!sub.isActive) {
      throw new ForbiddenException({
        code: 'SUBSCRIPTION_INACTIVE',
        message: 'Your subscription is inactive. Please renew your plan to continue using CafeFlow.',
        subscription: sub,
      });
    }
  }

  async startTrial(businessId: string, plan: string): Promise<Business> {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + this.TRIAL_DAYS * 24 * 60 * 60 * 1000);
    await this.businessesRepository.update(businessId, {
      plan,
      subscriptionStatus: SubscriptionStatus.TRIAL,
      trialEndsAt: trialEnd,
      currentPeriodEnd: trialEnd,
    });
    return this.businessesRepository.findOne({ where: { id: businessId } });
  }

  async activateSubscription(
    businessId: string,
    plan: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
  ): Promise<Business> {
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await this.businessesRepository.update(businessId, {
      plan,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: periodEnd,
      ...(stripeCustomerId && { stripeCustomerId }),
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    });
    return this.businessesRepository.findOne({ where: { id: businessId } });
  }

  async deactivateSubscription(businessId: string): Promise<Business> {
    await this.businessesRepository.update(businessId, {
      subscriptionStatus: SubscriptionStatus.INACTIVE,
    });
    return this.businessesRepository.findOne({ where: { id: businessId } });
  }

  async markPaymentFailed(businessId: string): Promise<Business> {
    await this.businessesRepository.update(businessId, {
      subscriptionStatus: SubscriptionStatus.PAST_DUE,
    });
    return this.businessesRepository.findOne({ where: { id: businessId } });
  }

  async updatePlan(businessId: string, plan: string): Promise<Business> {
    await this.businessesRepository.update(businessId, { plan });
    return this.businessesRepository.findOne({ where: { id: businessId } });
  }

  async verifyPaymentStatus(tenantId: string): Promise<{ businesses: any[] }> {
    const businesses = await this.businessesRepository.find({ where: { tenantId } });
    return {
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        plan: b.plan,
        subscriptionStatus: b.subscriptionStatus,
        trialEndsAt: b.trialEndsAt,
        currentPeriodEnd: b.currentPeriodEnd,
        isActive: !(
          b.subscriptionStatus === SubscriptionStatus.INACTIVE ||
          b.subscriptionStatus === SubscriptionStatus.CANCELED ||
          (b.subscriptionStatus === SubscriptionStatus.TRIAL && b.trialEndsAt && b.trialEndsAt < new Date()) ||
          b.subscriptionStatus === SubscriptionStatus.PAST_DUE
        ),
      })),
    };
  }
}