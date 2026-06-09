'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import {
  Megaphone, Plus, Target, Calendar, TrendingUp, Users, Clock, BarChart3, Send, Loader2,
} from 'lucide-react';

const campaigns = [
  { id: '1', name: 'Summer Special', type: 'Discount', status: 'Active', startDate: 'Jun 1, 2026', endDate: 'Jun 30, 2026', target: 'All Customers', budget: 500, reach: 1240, conversions: 89 },
  { id: '2', name: 'Happy Hour Promotion', type: 'Time-based', status: 'Scheduled', startDate: 'Jul 1, 2026', endDate: 'Jul 31, 2026', target: 'Lunch Crowd', budget: 300, reach: 0, conversions: 0 },
  { id: '3', name: 'New Menu Launch', type: 'Event', status: 'Draft', startDate: 'Aug 1, 2026', endDate: 'Aug 15, 2026', target: 'Regulars', budget: 800, reach: 0, conversions: 0 },
  { id: '4', name: 'Referral Program', type: 'Reward', status: 'Completed', startDate: 'May 1, 2026', endDate: 'May 31, 2026', target: 'All Customers', budget: 200, reach: 560, conversions: 45 },
  { id: '5', name: 'Weekend Brunch Deal', type: 'Discount', status: 'Active', startDate: 'Jun 1, 2026', endDate: 'Sep 1, 2026', target: 'Weekend Visitors', budget: 400, reach: 890, conversions: 67 },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  Draft: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
  Completed: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
};

const typeIcons: Record<string, React.ElementType> = {
  Discount: Target, 'Time-based': Clock, Event: Calendar, Reward: TrendingUp,
};

export default function MarketingPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const typeLabels: Record<string, string> = {
    Discount: t.dashboard.marketing.types.discount,
    'Time-based': t.dashboard.marketing.types.timeBased,
    Event: t.dashboard.marketing.types.event,
    Reward: t.dashboard.marketing.types.reward,
  };
  const statusLabels: Record<string, string> = {
    Active: t.dashboard.marketing.statuses.active,
    Scheduled: t.dashboard.marketing.statuses.scheduled,
    Draft: t.dashboard.marketing.statuses.draft,
    Completed: t.dashboard.marketing.statuses.completed,
  };
  const targetLabels: Record<string, string> = {
    'All Customers': t.dashboard.marketing.targets.allCustomers,
    Regulars: t.dashboard.marketing.targets.regulars,
    'New Customers': t.dashboard.marketing.targets.newCustomers,
    'Weekend Visitors': t.dashboard.marketing.targets.weekendVisitors,
    'Lunch Crowd': t.dashboard.marketing.targets.lunchCrowd,
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Discount', description: '', target: 'All Customers', budget: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    setSubmitting(false);
    setDialogOpen(false);
  };

  const totalReach = campaigns.reduce((a, c) => a + c.reach, 0);
  const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);
  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.marketing.title}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.marketing.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl hover:scale-105 transition-all"><Plus className="w-5 h-5 mr-2" /> {t.dashboard.marketing.newCampaign}</Button>} />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t.dashboard.marketing.createCampaign}</DialogTitle>
              <DialogDescription className="text-sm font-medium">Set up a new marketing campaign to drive sales</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.marketing.campaignName}</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Summer Special" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.dashboard.marketing.campaignType}</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Discount', 'Time-based', 'Event', 'Reward'].map(type => <SelectItem key={type} value={type} className="font-medium">{typeLabels[type]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.marketing.description}</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your campaign" className="bg-muted/50 border-0 focus-visible:ring-amber-500 resize-none" /></div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.dashboard.marketing.targetAudience}</Label>
                <Select value={form.target} onValueChange={v => setForm(p => ({ ...p, target: v }))}>
                  <SelectTrigger className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['All Customers', 'Regulars', 'New Customers', 'Weekend Visitors', 'Lunch Crowd'].map(target => <SelectItem key={target} value={target} className="font-medium">{targetLabels[target]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.marketing.budget} ($)</Label><Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 px-6 font-semibold rounded-xl border-border/50">{t.dashboard.marketing.cancel}</Button>
              <Button onClick={handleCreate} disabled={submitting} className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Send className="w-4 h-4 mr-2" />{t.dashboard.marketing.createCampaign}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.dashboard.marketing.activeCampaigns, value: activeCampaigns, icon: Megaphone, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: t.dashboard.marketing.totalReach, value: totalReach.toLocaleString(), icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: t.dashboard.marketing.conversions, value: totalConversions, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: t.dashboard.marketing.conversionRate, value: `${totalConversions > 0 ? Math.round((totalConversions / totalReach) * 100) : 0}%`, icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-amber-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground tracking-tight mb-1">{s.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => {
          const Icon = typeIcons[campaign.type] || Megaphone;
          return (
            <div key={campaign.id} className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0 border border-border/50">
                  <Icon className="w-6 h-6 text-foreground/70" />
                </div>
                <Badge className={`text-xs font-bold uppercase tracking-wider px-3 py-1 border-0 shadow-sm ${campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : campaign.status === 'Completed' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-muted text-muted-foreground'}`}>
                  {statusLabels[campaign.status]}
                </Badge>
              </div>
              <div className="relative z-10 flex-1">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider mb-3 bg-background border-border/50 shadow-sm">{typeLabels[campaign.type]}</Badge>
                <h3 className="text-xl font-extrabold text-foreground leading-tight group-hover:text-amber-600 transition-colors mb-4">{campaign.name}</h3>
                
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30">
                    <Calendar className="w-4 h-4 mr-3 text-amber-500 shrink-0" />
                    <span className="truncate">{campaign.startDate} - {campaign.endDate}</span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/30">
                    <Target className="w-4 h-4 mr-3 text-amber-500 shrink-0" />
                    <span className="truncate">{campaign.target}</span>
                  </div>
                </div>
              </div>

              {campaign.reach > 0 ? (
                <div className="relative z-10 grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center bg-muted/20 p-2 rounded-lg">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{t.dashboard.marketing.reach}</p>
                    <p className="text-sm font-extrabold text-foreground">{campaign.reach}</p>
                  </div>
                  <div className="text-center bg-muted/20 p-2 rounded-lg">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{t.dashboard.marketing.conversions}</p>
                    <p className="text-sm font-extrabold text-foreground">{campaign.conversions}</p>
                  </div>
                  <div className="text-center bg-amber-500/10 dark:bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-0.5">{t.dashboard.marketing.rate}</p>
                    <p className="text-sm font-extrabold text-amber-700 dark:text-amber-400">{Math.round((campaign.conversions / campaign.reach) * 100)}%</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 pt-4 border-t border-border/50 flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</span>
                   <span className="text-base font-extrabold text-foreground">{formatCurrency(campaign.budget, currency)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
