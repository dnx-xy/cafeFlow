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
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { useI18n } from '@/i18n/context';
import {
  Award, Gift, Star, Users, TrendingUp, Plus, Settings, Coins, Sparkles, Crown, Loader2,
  Settings as SettingsIcon,
} from 'lucide-react';

const REWARD_TYPE_LABELS: Record<string, string> = {
  DISCOUNT: 'Discount', FREE_ITEM: 'Free Item', VOUCHER: 'Voucher', EXCLUSIVE_ACCESS: 'Exclusive Access',
};

// These would be replaced with real API data in production
const mockTopCustomers = [];
const mockTransactions = [];

function mockTiers() {
  return [
    { name: 'Bronze', minPoints: 0, color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', icon: Star, perks: 'Welcome offer' },
    { name: 'Silver', minPoints: 500, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-500/10', border: 'border-gray-200 dark:border-gray-500/20', icon: Award, perks: 'Free coffee on birthday' },
    { name: 'Gold', minPoints: 1500, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', icon: Crown, perks: '10% discount every order' },
  ];
}

export default function LoyaltyPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const { program, rewards, loading, error, fetchProgram, updateProgram, fetchRewards } = useLoyalty();
  const [activeTab, setActiveTab] = useState('overview');
  const [programDialog, setProgramDialog] = useState(false);
  const [progForm, setProgForm] = useState({ pointsPerRupiah: 1, minimumPurchase: 0, maximumPointsPerOrder: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProgram(); fetchRewards(); }, []);

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
    } finally { setSaving(false); }
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
  const tierNameMap: Record<string, string> = { Bronze: t.dashboard.loyalty.bronze, Silver: t.dashboard.loyalty.silver, Gold: t.dashboard.loyalty.gold };
  const tierPerksMap: Record<string, string> = { 'Welcome offer': t.dashboard.loyalty.welcomeOffer, 'Free coffee on birthday': t.dashboard.loyalty.freeCoffeeBirthday, '10% discount every order': t.dashboard.loyalty.tenPercentDiscount };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.loyalty.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.loyalty.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={openProgramSettings} className="shrink-0" disabled={!program}>
          <SettingsIcon className="w-4 h-4 mr-1.5" /> {t.dashboard.loyalty.programSettings}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t.dashboard.loyalty.activeMembers, value: '0', icon: Award },
          { label: t.dashboard.loyalty.pointsIssued, value: '0', icon: Coins },
          { label: t.dashboard.loyalty.rewardsRedeemed, value: '0', icon: Gift },
          { label: t.dashboard.loyalty.retentionRate, value: '0%', icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-amber-50 dark:bg-amber-500/10' : i === 1 ? 'bg-blue-50 dark:bg-blue-500/10' : i === 2 ? 'bg-green-50 dark:bg-green-500/10' : 'bg-purple-50 dark:bg-purple-500/10'}`}>
                <s.icon className={`w-4 h-4 ${i === 0 ? 'text-amber-600 dark:text-amber-400' : i === 1 ? 'text-blue-600 dark:text-blue-400' : i === 2 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="overview" className="sm:flex-1">{t.dashboard.loyalty.overview}</TabsTrigger>
          <TabsTrigger value="rewards" className="sm:flex-1">{t.dashboard.loyalty.rewards}</TabsTrigger>
          <TabsTrigger value="tiers" className="sm:flex-1">{t.dashboard.loyalty.tiers}</TabsTrigger>
          <TabsTrigger value="activity" className="sm:flex-1">{t.dashboard.loyalty.activity}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />{program?.name || t.dashboard.loyalty.programName}
              </h3>
              <div className="space-y-2.5 text-sm">
{[
                    [t.dashboard.loyalty.status, <Badge key="s" variant="outline" className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10">Active</Badge>],
                    [t.dashboard.loyalty.pointsPer, program?.pointsPerRupiah || 1],
                    [t.dashboard.loyalty.minPurchase, formatCurrency(program?.minimumPurchase || 0, currency)],
                    [t.dashboard.loyalty.maxPerOrder, program?.maximumPointsPerOrder || t.dashboard.loyalty.unlimited],
                  ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{label as string}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-green-500" />{t.dashboard.loyalty.availableRewards}
              </h3>
              <div className="space-y-2.5">
                {rewards.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{r.name}</p>
                      <p className="text-xs text-gray-400">{{ DISCOUNT: t.dashboard.loyalty.discount, FREE_ITEM: t.dashboard.loyalty.freeItem, VOUCHER: t.dashboard.loyalty.voucher, EXCLUSIVE_ACCESS: t.dashboard.loyalty.exclusiveAccess }[r.rewardType]}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">{r.pointsRequired} {t.dashboard.loyalty.pointsLabel}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-500" />{t.dashboard.loyalty.topMembers}
              </h3>
              <div className="space-y-2.5">
                {mockTopCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{c.name}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0 ml-2">{c.points} {t.dashboard.loyalty.pointsLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rewards.map(r => (
              <div key={r.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <Badge variant="outline" className="text-[10px]">{{ DISCOUNT: t.dashboard.loyalty.discount, FREE_ITEM: t.dashboard.loyalty.freeItem, VOUCHER: t.dashboard.loyalty.voucher, EXCLUSIVE_ACCESS: t.dashboard.loyalty.exclusiveAccess }[r.rewardType]}</Badge>
                  <Badge className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">{r.pointsRequired} {t.dashboard.loyalty.pointsLabel}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.name}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{r.description || t.dashboard.loyalty.noDescription}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiers.map(tier => (
              <div key={tier.name} className={`${tier.bg} ${tier.border} rounded-xl border p-6 text-center`}>
                <tier.icon className={`w-10 h-10 mx-auto mb-3 ${tier.color}`} />
                <p className={`text-base font-bold ${tier.color}`}>{tierNameMap[tier.name]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tier.minPoints}+ points</p>
                <Separator className="my-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{tierPerksMap[tier.perks]}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
            <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {mockTransactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.type === 'EARNED' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'}`}>
                      {t.type === 'EARNED' ? '+' : '-'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{t.customer}</p>
                      <p className="text-xs text-gray-400 truncate">{t.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-medium ${t.type === 'EARNED' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {t.type === 'EARNED' ? '+' : '-'}{t.points}
                    </p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={programDialog} onOpenChange={setProgramDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dashboard.loyalty.programSettings}</DialogTitle>
            <DialogDescription>{t.dashboard.loyalty.configureRules}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>{t.dashboard.loyalty.pointsPerDollar}</Label><Input type="number" value={progForm.pointsPerRupiah} onChange={e => setProgForm(p => ({ ...p, pointsPerRupiah: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>{t.dashboard.loyalty.minimumPurchase}</Label><Input type="number" value={progForm.minimumPurchase} onChange={e => setProgForm(p => ({ ...p, minimumPurchase: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>{t.dashboard.loyalty.maxPointsPerOrder} ({t.dashboard.loyalty.zeroUnlimited})</Label><Input type="number" value={progForm.maximumPointsPerOrder} onChange={e => setProgForm(p => ({ ...p, maximumPointsPerOrder: Number(e.target.value) }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramDialog(false)}>{t.dashboard.loyalty.cancel}</Button>
            <Button onClick={handleSaveProgram} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t.dashboard.loyalty.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
