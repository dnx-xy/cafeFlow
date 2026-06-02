'use client';

import { useState } from 'react';
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
  const { currency } = useCurrency();
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Campaigns</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage promotional campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> New Campaign</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
              <DialogDescription>Set up a new marketing campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Campaign Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Summer Special" /></div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Discount', 'Time-based', 'Event', 'Reward'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your campaign" /></div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={form.target} onValueChange={v => setForm(p => ({ ...p, target: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['All Customers', 'Regulars', 'New Customers', 'Weekend Visitors', 'Lunch Crowd'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Budget ($)</Label><Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Send className="w-4 h-4 mr-2" />Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Campaigns', value: activeCampaigns, icon: Megaphone, color: 'text-amber-500' },
          { label: 'Total Reach', value: totalReach.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: 'Conversions', value: totalConversions, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Conversion Rate', value: `${totalConversions > 0 ? Math.round((totalConversions / totalReach) * 100) : 0}%`, icon: BarChart3, color: 'text-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
            <div className="flex items-center gap-2 mb-1.5"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {campaigns.map(campaign => {
          const Icon = typeIcons[campaign.type] || Megaphone;
          return (
            <div key={campaign.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{campaign.name}</p>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{campaign.type}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{campaign.startDate} - {campaign.endDate}</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />{campaign.target}</span>
                    </div>
                    {campaign.reach > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>Reach: <strong className="text-gray-700 dark:text-gray-300">{campaign.reach}</strong></span>
                        <span>Conversions: <strong className="text-gray-700 dark:text-gray-300">{campaign.conversions}</strong></span>
                        <span>Rate: <strong className="text-gray-700 dark:text-gray-300">{Math.round((campaign.conversions / campaign.reach) * 100)}%</strong></span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formatCurrency(campaign.budget, currency)}</span>
                  <Badge variant="outline" className={`text-[10px] ${statusColors[campaign.status] || ''}`}>{campaign.status}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
