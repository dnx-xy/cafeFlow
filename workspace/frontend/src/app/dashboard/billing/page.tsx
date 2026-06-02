'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard, Check, Zap, Building2, GraduationCap, Sparkles,
  Download, ArrowRight, Clock, DollarSign, FileText, Shield
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 29,
    icon: GraduationCap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    features: ['Up to 200 orders/month', '1 outlet', 'Basic analytics', 'Email support', 'QR code generation'],
    popular: false,
  },
  {
    name: 'Pro',
    price: 79,
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    features: ['Up to 1000 orders/month', '3 outlets', 'Advanced analytics', 'Priority support', 'Loyalty program', 'Marketing campaigns', 'Staff management'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    icon: Building2,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    features: ['Unlimited orders', 'Unlimited outlets', 'Custom analytics', '24/7 support', 'White-label QR codes', 'API access', 'Dedicated account manager'],
    popular: false,
  },
];

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
  const [currentPlan] = useState('Pro');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Billing & Subscription</h2>
          <p className="text-sm text-muted-foreground">Manage your plan and payment details</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <CreditCard className="w-3 h-3 mr-1 inline" />
          Pro Plan
        </Badge>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Pro Plan</p>
                <p className="text-sm text-muted-foreground">$79/month · Renews on July 1, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">Change Plan</Button>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" /> Upgrade
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageStats.map(s => {
              const pct = (s.used / s.limit) * 100;
              return (
                <div key={s.label}>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-medium mt-1">
                    {s.used}{s.unit || ''} / {s.limit}{s.unit || ''}
                  </p>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">Compare Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => {
            const isCurrent = plan.name === currentPlan;
            return (
              <Card key={plan.name} className={`border-0 shadow-sm relative ${plan.popular ? 'ring-2 ring-amber-300' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-10 h-10 ${plan.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                  </div>
                  <p className="text-lg font-bold text-foreground">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${isCurrent ? 'bg-muted text-muted-foreground cursor-default' : ''}`}
                    variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${inv.amount}</span>
                    <Badge variant="outline" className="text-xs text-green-600 bg-green-50">{inv.status}</Badge>
                    <Button variant="ghost" size="icon" className="w-7 h-7">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
