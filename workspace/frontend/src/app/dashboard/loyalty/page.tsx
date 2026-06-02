'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLoyalty } from '@/hooks/useLoyalty';
import {
  Award, Gift, Star, Users, TrendingUp, Plus, Settings, Coins, Sparkles, Crown, Loader2
} from 'lucide-react';

const REWARD_TYPE_LABELS: Record<string, string> = {
  DISCOUNT: 'Discount',
  FREE_ITEM: 'Free Item',
  VOUCHER: 'Voucher',
  EXCLUSIVE_ACCESS: 'Exclusive Access',
};

const mockTopCustomers = [
  { name: 'Sarah Johnson', points: 2450, visits: 48 },
  { name: 'Mike Chen', points: 1820, visits: 36 },
  { name: 'Emily Davis', points: 1560, visits: 29 },
  { name: 'James Wilson', points: 920, visits: 18 },
  { name: 'Lisa Brown', points: 740, visits: 14 },
];

const mockRecentTransactions = [
  { customer: 'Sarah J.', points: 50, type: 'EARNED' as const, desc: 'Order #1042', date: 'Today' },
  { customer: 'Mike C.', points: 150, type: 'SPENT' as const, desc: 'Free Coffee reward', date: 'Today' },
  { customer: 'Emily D.', points: 35, type: 'EARNED' as const, desc: 'Order #1040', date: 'Yesterday' },
  { customer: 'James W.', points: 250, type: 'SPENT' as const, desc: '$5 Discount reward', date: 'Yesterday' },
  { customer: 'Lisa B.', points: 20, type: 'EARNED' as const, desc: 'Order #1038', date: '2 days ago' },
];

function mockTiers() {
  return [
    { name: 'Bronze', minPoints: 0, color: 'text-amber-700', bg: 'bg-amber-50', icon: Star, perks: 'Welcome offer' },
    { name: 'Silver', minPoints: 500, color: 'text-gray-600', bg: 'bg-gray-50', icon: Award, perks: 'Free coffee on birthday' },
    { name: 'Gold', minPoints: 1500, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Crown, perks: '10% discount every order' },
  ];
}

export default function LoyaltyPage() {
  const { program, rewards, loading, error, fetchProgram, updateProgram, fetchRewards } = useLoyalty();
  const [activeTab, setActiveTab] = useState('overview');
  const [programDialog, setProgramDialog] = useState(false);
  const [progForm, setProgForm] = useState({ pointsPerRupiah: 1, minimumPurchase: 0, maximumPointsPerOrder: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProgram();
    fetchRewards();
  }, []);

  const handleSaveProgram = async () => {
    if (!program) return;
    setSaving(true);
    try {
      await updateProgram(program.id, {
        pointsPerRupiah: progForm.pointsPerRupiah,
        minimumPurchase: progForm.minimumPurchase,
        maximumPointsPerOrder: progForm.maximumPointsPerOrder || undefined,
      });
      setProgramDialog(false);
    } finally {
      setSaving(false);
    }
  };

  const openProgramSettings = () => {
    if (program) {
      setProgForm({
        pointsPerRupiah: program.pointsPerRupiah,
        minimumPurchase: program.minimumPurchase,
        maximumPointsPerOrder: program.maximumPointsPerOrder || 0,
      });
      setProgramDialog(true);
    }
  };

  const tiers = mockTiers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Loyalty Program</h2>
          <p className="text-sm text-muted-foreground">Reward your loyal customers and drive repeat visits</p>
        </div>
        <Button variant="outline" onClick={openProgramSettings} className="shrink-0">
          <Settings className="w-4 h-4 mr-2" /> Program Settings
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">2,450</p>
            <p className="text-xs text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Coins className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">7,490</p>
            <p className="text-xs text-muted-foreground">Points Issued</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Rewards Redeemed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">68%</p>
            <p className="text-xs text-muted-foreground">Retention Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="overview" className="sm:flex-1">Overview</TabsTrigger>
          <TabsTrigger value="rewards" className="sm:flex-1">Rewards</TabsTrigger>
          <TabsTrigger value="tiers" className="sm:flex-1">Tiers</TabsTrigger>
          <TabsTrigger value="activity" className="sm:flex-1">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Program Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {program?.name || 'Loyalty Program'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points per $1</span>
                    <span className="font-medium">{program?.pointsPerRupiah || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min. Purchase</span>
                    <span className="font-medium">${(program?.minimumPurchase || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max per Order</span>
                    <span className="font-medium">{program?.maximumPointsPerOrder || 'Unlimited'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-500" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewards.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{REWARD_TYPE_LABELS[r.rewardType]}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 ml-2">{r.pointsRequired} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Top Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTopCustomers.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                        <p className="text-sm truncate">{c.name}</p>
                      </div>
                      <span className="text-xs font-medium shrink-0 ml-2">{c.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map(r => (
              <Card key={r.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {REWARD_TYPE_LABELS[r.rewardType]}
                    </Badge>
                    <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">{r.pointsRequired} pts</Badge>
                  </div>
                  <p className="font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description || 'No description'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers.map(tier => (
              <Card key={tier.name} className={`border-0 shadow-sm ${tier.bg}`}>
                <CardContent className="p-6 text-center">
                  <tier.icon className={`w-10 h-10 mx-auto mb-3 ${tier.color}`} />
                  <p className={`text-lg font-bold ${tier.color}`}>{tier.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{tier.minPoints}+ points</p>
                  <Separator className="my-3" />
                  <p className="text-sm">{tier.perks}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="divide-y">
                {mockRecentTransactions.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.type === 'EARNED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {t.type === 'EARNED' ? '+' : '-'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.customer}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-medium ${t.type === 'EARNED' ? 'text-green-600' : 'text-blue-600'}`}>
                        {t.type === 'EARNED' ? '+' : '-'}{t.points}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Program Settings Dialog */}
      <Dialog open={programDialog} onOpenChange={setProgramDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Program Settings</DialogTitle>
            <DialogDescription>Configure your loyalty program rules</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Points per $1 spent</Label>
              <Input type="number" value={progForm.pointsPerRupiah} onChange={e => setProgForm(p => ({ ...p, pointsPerRupiah: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Minimum Purchase ($)</Label>
              <Input type="number" value={progForm.minimumPurchase} onChange={e => setProgForm(p => ({ ...p, minimumPurchase: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Max Points Per Order (0 = unlimited)</Label>
              <Input type="number" value={progForm.maximumPointsPerOrder} onChange={e => setProgForm(p => ({ ...p, maximumPointsPerOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProgram} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
