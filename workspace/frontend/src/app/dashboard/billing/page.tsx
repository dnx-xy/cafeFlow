'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import {
  CreditCard, Check, Zap, Building2, GraduationCap, Sparkles,
  Download, ArrowRight, Clock, DollarSign, FileText, Shield,
  Settings as SettingsIcon,
} from 'lucide-react';

// These would be replaced with real API data in production
const plans = [];

const invoices = [
  { id: 'INV-2026-001', date: 'Jun 1, 2026', amount: 79, status: 'Paid' },
  { id: 'INV-2026-002', date: 'May 1, 2026', amount: 79, status: 'Paid' },
  { id: 'INV-2026-003', date: 'Apr 1, 2026', amount: 79, status: 'Paid' },
  { id: 'INV-2026-004', date: 'Mar 1, 2026', amount: 79, status: 'Paid' },
];

const usageStats = [
  { label: 'Orders this month', used: 847, limit: 1000, color: 'bg-amber-500' },
  { label: 'Storage used', used: 1.2, limit: 5, unit: 'GB', color: 'bg-blue-500' },
  { label: 'Team members', used: 5, limit: 10, color: 'bg-green-500' },
  { label: 'QR codes', used: 24, limit: 50, color: 'bg-purple-500' },
];

export default function BillingPage() {
  const { currency } = useCurrency();
  const [currentPlan] = useState('Pro');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Billing & Subscription</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your plan and payment details</p>
        </div>
        <Badge variant="outline" className="text-[10px]"><CreditCard className="w-3 h-3 mr-1 inline" />Pro Plan</Badge>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white">Pro Plan</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(79, currency)}/month · Renews on July 1, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success('Change Plan modal would open here')}>Change Plan</Button>
            <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white" onClick={() => toast.success('Upgrade process would start here')}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />Upgrade
            </Button>
          </div>
        </div>
        <Separator className="my-4 bg-amber-100 dark:bg-amber-500/10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Orders this month', used: 0, limit: 1000, color: 'bg-amber-500' },
            { label: 'Storage used', used: 0, limit: 5, unit: 'GB', color: 'bg-blue-500' },
            { label: 'Team members', used: 0, limit: 10, color: 'bg-green-500' },
            { label: 'QR codes', used: 0, limit: 50, color: 'bg-purple-500' },
          ].map(s => {
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
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Compare Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => {
            const isCurrent = plan.name === currentPlan;
            return (
              <div key={plan.name} className={`bg-white dark:bg-[#16181f] rounded-xl border ${plan.popular ? 'border-amber-300 dark:border-amber-500/30 ring-1 ring-amber-200 dark:ring-amber-500/20' : 'border-gray-100 dark:border-gray-800/50'} relative p-5`}>
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-[10px] font-medium">Most Popular</Badge>
                  </div>
                )}
                <div className={`w-9 h-9 ${plan.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <plan.icon className={`w-4.5 h-4.5 ${plan.color}`} />
                </div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(plan.price, currency)}</span>
                  <span className="text-xs text-gray-400">/month</span>
                </div>
                <Separator className="my-3" />
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full mt-5 h-9 text-sm ${isCurrent ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default' : ''}`}
                  variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'} disabled={isCurrent}>
                  {isCurrent ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4" />Payment Method</h3>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Visa ending in 4242</p>
                <p className="text-xs text-gray-400">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><FileText className="w-4 h-4" />Recent Invoices</h3>
          <div className="space-y-0">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{inv.id}</p>
                  <p className="text-xs text-gray-400">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(inv.amount, currency)}</span>
                  <Badge variant="outline" className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20">{inv.status}</Badge>
                  <Button variant="ghost" size="icon" className="w-7 h-7"><Download className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
