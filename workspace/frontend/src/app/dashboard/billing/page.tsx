'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useI18n } from '@/i18n/context';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';
import {
  CreditCard, Check, Zap, Sparkles, Download, FileText, Loader2,
} from 'lucide-react';

const BASE_PLAN_PRICES: Record<string, number> = {
  Free: 0,
  Starter: 19,
  Growth: 49,
  Pro: 129,
  Enterprise: 129,
};

const INVOICE_AMOUNTS: Record<string, number> = {
  'INV-2026-001': 79,
  'INV-2026-002': 79,
  'INV-2026-003': 79,
  'INV-2026-004': 79,
};

export default function BillingPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [planDialog, setPlanDialog] = useState(false);
  const [changing, setChanging] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  const currentPlanName = subscription?.plan || 'Free';

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (t.home?.pricing?.plans) {
      const paid = t.home.pricing.plans.filter((p: any) => {
        const price = parseFloat(p.price?.toString().replace(/[^0-9]/g, ''));
        return price > 0;
      });
      setPlans(paid);
    }
  }, [t.home?.pricing]);

  const formatPlanPrice = (planName: string) => {
    const base = BASE_PLAN_PRICES[planName];
    if (base === undefined) return `${planName}`;
    return formatCurrency(base, currency);
  };

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/payments/subscription');
      setSubscription(res.data);
    } catch {
      setSubscription({
        plan: 'Free',
        subscriptionStatus: 'active',
        trialEndsAt: null,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleActivatePlan = async (plan: string) => {
    setChanging(true);
    try {
      await apiClient.post('/payments/activate', { plan });
      toast.success(`Plan changed to ${plan}`);
      setPlanDialog(false);
      loadSubscription();
    } catch {
      toast.error('Failed to change plan');
    } finally {
      setChanging(false);
    }
  };

  const invoices = [
    { id: 'INV-2026-001', date: 'Jun 1, 2026', status: 'Paid' },
    { id: 'INV-2026-002', date: 'May 1, 2026', status: 'Paid' },
    { id: 'INV-2026-003', date: 'Apr 1, 2026', status: 'Paid' },
    { id: 'INV-2026-004', date: 'Mar 1, 2026', status: 'Paid' },
  ];

  const usageStats = [
    { label: t.dashboard.billing.ordersThisMonth, used: 847, limit: 1000, color: 'bg-amber-500' },
    { label: t.dashboard.billing.storageUsed, used: 1.2, limit: 5, unit: 'GB', color: 'bg-blue-500' },
    { label: t.dashboard.billing.teamMembers, used: 5, limit: 10, color: 'bg-green-500' },
    { label: t.dashboard.billing.qrCodes, used: 24, limit: 50, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.billing.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.billing.subtitle}</p>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{currentPlanName} {t.dashboard.billing.currentPlan}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatPlanPrice(currentPlanName)}/month {t.dashboard.billing.renewsOn.replace('{{date}}', formatDate(subscription?.currentPeriodEnd))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setPlanDialog(true)}>{t.dashboard.billing.changePlan}</Button>
            <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white" onClick={() => setPlanDialog(true)}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />{t.dashboard.billing.upgrade}
            </Button>
          </div>
        </div>
        <Separator className="my-4 bg-amber-100 dark:bg-amber-500/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usageStats.map(s => {
            const pct = (s.used / s.limit) * 100;
            return (
              <div key={s.label}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{s.used}{s.unit || ''} / {s.limit}{s.unit || ''}</p>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t.dashboard.billing.comparePlans}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t.dashboard.billing.comparePlans}</div>
          ) : plans.map((plan: any) => {
            const isCurrent = plan.name === currentPlanName;
            return (
              <div key={plan.name} className={`bg-white dark:bg-[#16181f] rounded-xl border ${plan.popular ? 'border-amber-300 dark:border-amber-500/30 ring-1 ring-amber-200 dark:ring-amber-500/20' : 'border-gray-100 dark:border-gray-800/50'} relative p-5`}>
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-[10px] font-medium">{t.dashboard.billing.upgrade}</Badge>
                  </div>
                )}
                <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPlanPrice(plan.name)}</span>
                  <span className="text-xs text-gray-400">{t.dashboard.billing.month}</span>
                </div>
                <Separator className="my-3" />
                <ul className="space-y-2">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full mt-5 h-9 text-sm ${isCurrent ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default' : ''}`}
                  variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                  disabled={isCurrent}
                  onClick={() => !isCurrent && handleActivatePlan(plan.name)}>
                  {isCurrent ? t.dashboard.billing.currentPlanLabel : t.dashboard.billing.upgrade}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4" />{t.dashboard.billing.paymentMethod}</h3>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.dashboard.billing.visaEnding.replace('{number}', '4242')}</p>
                <p className="text-xs text-gray-400">{t.dashboard.billing.expires.replace('{date}', '12/2027')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">{t.dashboard.billing.edit}</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><FileText className="w-4 h-4" />{t.dashboard.billing.recentInvoices}</h3>
          <div className="space-y-0">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{inv.id}</p>
                  <p className="text-xs text-gray-400">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(INVOICE_AMOUNTS[inv.id] || 0, currency)}</span>
                  <Badge variant="outline" className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">{t.dashboard.billing.paid}</Badge>
                  <Button variant="ghost" size="icon" className="w-7 h-7"><Download className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={planDialog} onOpenChange={setPlanDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.dashboard.billing.changePlan}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {plans.map((plan: any) => {
              const isCurrent = plan.name === currentPlanName;
              return (
                <div key={plan.name} className={`flex items-center justify-between p-4 rounded-xl border ${isCurrent ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5' : 'border-gray-100 dark:border-gray-800/50'} ${plan.popular ? 'ring-1 ring-amber-200 dark:ring-amber-500/20' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                      {plan.popular && <Badge className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">{t.dashboard.billing.upgrade}</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.features?.slice(0, 3).join(' · ')}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPlanPrice(plan.name)}/{t.dashboard.billing.month.replace('/', '')}</span>
                    <Button size="sm" className="h-8 text-xs" variant={isCurrent ? 'outline' : 'default'} disabled={isCurrent || changing}
                      onClick={() => !isCurrent && handleActivatePlan(plan.name)}>
                      {changing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isCurrent ? t.dashboard.billing.currentPlanLabel : t.dashboard.billing.upgrade}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}