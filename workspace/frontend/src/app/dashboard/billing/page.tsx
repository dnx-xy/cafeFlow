'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  const currentPlan = plans.find(p => p.name === currentPlanName);

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (t.home?.pricing?.plans) {
      setPlans(t.home.pricing.plans);
    }
  }, [t.home?.pricing]);

  const getPlanPrice = (plan: any) => {
    if (!plan) return '';
    return plan.price;
  };

  const getPlanPeriod = (plan: any) => {
    if (!plan || plan.price === 'Custom') return '';
    return plan.period || t.dashboard.billing.month;
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

      <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t.dashboard.billing.currentPlan}</p>
              <h3 className="text-3xl font-extrabold text-foreground">{currentPlanName} Plan</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{getPlanPrice(currentPlan)}</span><span className="text-amber-600 dark:text-amber-400 font-bold">{getPlanPeriod(currentPlan)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{t.dashboard.billing.renewsOn.replace('{{date}}', formatDate(subscription?.currentPeriodEnd))}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button variant="outline" size="sm" className="h-11 px-6 font-semibold w-full sm:w-auto rounded-xl" onClick={() => setPlanDialog(true)}>{t.dashboard.billing.changePlan}</Button>
            <Button size="sm" className="h-11 px-6 font-bold w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-xl" onClick={() => setPlanDialog(true)}>
              <Sparkles className="w-4 h-4 mr-2" />{t.dashboard.billing.upgrade}
            </Button>
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-border/50">
          {usageStats.map(s => {
            const pct = (s.used / s.limit) * 100;
            return (
              <div key={s.label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-xl font-bold text-foreground">{s.used}{s.unit || ''}</span>
                  <span className="text-sm font-medium text-muted-foreground">/ {s.limit}{s.unit || ''}</span>
                </div>
                <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-foreground mb-4">{t.dashboard.billing.comparePlans}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-sm font-medium text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl">{t.dashboard.billing.comparePlans}</div>
          ) : plans.map((plan: any) => {
            const isCurrent = plan.name === currentPlanName;
            return (
              <div key={plan.name} className={`bg-card rounded-3xl border ${plan.popular ? 'border-amber-500 shadow-xl scale-105 z-10 bg-amber-50/10 dark:bg-amber-500/5' : 'border-border/50 shadow-sm'} relative p-6 sm:p-8 flex flex-col transition-all hover:border-amber-500/30`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-[10px] font-bold tracking-wider px-3 py-1 shadow-md">{t.dashboard.billing.upgrade}</Badge>
                  </div>
                )}
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-xl font-bold text-foreground mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">{getPlanPeriod(plan)}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.slice(0, 5).map((f: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-muted-foreground flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full mt-auto h-12 rounded-xl font-bold text-base ${isCurrent ? 'bg-muted/50 text-muted-foreground cursor-default hover:bg-muted/50 border-0' : plan.popular ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20' : ''}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:border-amber-500/30 transition-all">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6"><CreditCard className="w-5 h-5 text-amber-500" />{t.dashboard.billing.paymentMethod}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold tracking-widest shadow-inner">VISA</div>
              <div>
                <p className="text-base font-bold text-foreground">{t.dashboard.billing.visaEnding.replace('{number}', '4242')}</p>
                <p className="text-sm font-medium text-muted-foreground">{t.dashboard.billing.expires.replace('{date}', '12/2027')}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-10 rounded-xl font-semibold w-full sm:w-auto">{t.dashboard.billing.edit}</Button>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:border-amber-500/30 transition-all">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6"><FileText className="w-5 h-5 text-amber-500" />{t.dashboard.billing.recentInvoices}</h3>
          <div className="space-y-2">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-bold text-foreground">{inv.id}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-foreground">{formatCurrency(INVOICE_AMOUNTS[inv.id] || 0, currency)}</span>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-0">{t.dashboard.billing.paid}</Badge>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted"><Download className="w-4 h-4 text-muted-foreground" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={planDialog} onOpenChange={setPlanDialog}>
        <DialogContent className="sm:max-w-xl rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.dashboard.billing.changePlan}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {plans.map((plan: any) => {
              const isCurrent = plan.name === currentPlanName;
              return (
                <div key={plan.name} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isCurrent ? 'border-amber-500 shadow-md bg-amber-50/50 dark:bg-amber-500/5' : 'border-border/50 hover:border-amber-500/30 bg-card hover:shadow-sm'} ${plan.popular ? 'ring-2 ring-amber-500/20' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-base font-bold text-foreground">{plan.name}</p>
                      {plan.popular && <Badge className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm">{t.dashboard.billing.upgrade}</Badge>}
                      {isCurrent && <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 font-bold uppercase tracking-wider px-2 py-0.5">Active</Badge>}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground line-clamp-1">{plan.features?.slice(0, 3).join(' · ')}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right">
                   <span className="text-lg font-extrabold text-foreground block">{plan.price}</span>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{getPlanPeriod(plan)}</span>
                    </div>
                    <Button className={`h-11 px-6 rounded-xl font-bold ${isCurrent ? 'bg-muted/50 text-muted-foreground hover:bg-muted/50' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'}`} variant={isCurrent ? 'outline' : 'default'} disabled={isCurrent || changing}
                      onClick={() => !isCurrent && handleActivatePlan(plan.name)}>
                      {changing ? <Loader2 className="w-5 h-5 animate-spin" /> : isCurrent ? t.dashboard.billing.currentPlanLabel : t.dashboard.billing.upgrade}
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