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
import {
  Megaphone, Plus, Target, Calendar, TrendingUp, Users, Clock, BarChart3, Send, Loader2
} from 'lucide-react';

const campaigns = [
  {
    id: '1',
    name: 'Summer Special',
    type: 'Discount',
    status: 'Active',
    startDate: 'Jun 1, 2026',
    endDate: 'Jun 30, 2026',
    target: 'All Customers',
    budget: 500,
    reach: 1240,
    conversions: 89,
  },
  {
    id: '2',
    name: 'Happy Hour Promotion',
    type: 'Time-based',
    status: 'Scheduled',
    startDate: 'Jul 1, 2026',
    endDate: 'Jul 31, 2026',
    target: 'Lunch Crowd',
    budget: 300,
    reach: 0,
    conversions: 0,
  },
  {
    id: '3',
    name: 'New Menu Launch',
    type: 'Event',
    status: 'Draft',
    startDate: 'Aug 1, 2026',
    endDate: 'Aug 15, 2026',
    target: 'Regulars',
    budget: 800,
    reach: 0,
    conversions: 0,
  },
  {
    id: '4',
    name: 'Referral Program',
    type: 'Reward',
    status: 'Completed',
    startDate: 'May 1, 2026',
    endDate: 'May 31, 2026',
    target: 'All Customers',
    budget: 200,
    reach: 560,
    conversions: 45,
  },
  {
    id: '5',
    name: 'Weekend Brunch Deal',
    type: 'Discount',
    status: 'Active',
    startDate: 'Jun 1, 2026',
    endDate: 'Sep 1, 2026',
    target: 'Weekend Visitors',
    budget: 400,
    reach: 890,
    conversions: 67,
  },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  Draft: 'bg-gray-100 text-gray-700 border-gray-200',
  Completed: 'bg-purple-100 text-purple-700 border-purple-200',
};

const typeIcons: Record<string, React.ElementType> = {
  Discount: Target,
  'Time-based': Clock,
  Event: Calendar,
  Reward: TrendingUp,
};

export default function MarketingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Discount', description: '', target: 'All Customers', budget: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    // Simulate API call
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Marketing Campaigns</h2>
          <p className="text-sm text-muted-foreground">Create and manage promotional campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="w-4 h-4 mr-2" /> New Campaign
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
              <DialogDescription>Set up a new marketing campaign</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Summer Special" />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Discount">Discount</SelectItem>
                    <SelectItem value="Time-based">Time-based</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Reward">Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your campaign" />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={form.target} onValueChange={v => setForm(p => ({ ...p, target: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Customers">All Customers</SelectItem>
                    <SelectItem value="Regulars">Regulars</SelectItem>
                    <SelectItem value="New Customers">New Customers</SelectItem>
                    <SelectItem value="Weekend Visitors">Weekend Visitors</SelectItem>
                    <SelectItem value="Lunch Crowd">Lunch Crowd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget ($)</Label>
                <Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" /> Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{activeCampaigns}</p>
            <p className="text-xs text-muted-foreground">Active Campaigns</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Reach</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalConversions}</p>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalConversions > 0 ? Math.round((totalConversions / totalReach) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns.map(campaign => {
          const Icon = typeIcons[campaign.type] || Megaphone;
          return (
            <Card key={campaign.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{campaign.type}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {campaign.target}
                        </span>
                      </div>
                      {campaign.reach > 0 && (
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span>Reach: <strong>{campaign.reach}</strong></span>
                          <span>Conversions: <strong>{campaign.conversions}</strong></span>
                          <span>Rate: <strong>{Math.round((campaign.conversions / campaign.reach) * 100)}%</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">${campaign.budget}</span>
                    <Badge variant="outline" className={`text-xs ${statusColors[campaign.status] || ''}`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
