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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.loyalty.title}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.loyalty.subtitle}</p>
        </div>
        <Button variant="outline" className="h-11 px-6 rounded-xl font-bold bg-card border-border/50 shadow-sm shrink-0" onClick={openProgramSettings} disabled={!program}>
          <SettingsIcon className="w-4 h-4 mr-2 text-amber-500" /> {t.dashboard.loyalty.programSettings}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t.dashboard.loyalty.activeMembers, value: '0', icon: Award, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: t.dashboard.loyalty.pointsIssued, value: '0', icon: Coins, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: t.dashboard.loyalty.rewardsRedeemed, value: '0', icon: Gift, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: t.dashboard.loyalty.retentionRate, value: '0%', icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border/50 p-6 flex flex-col justify-between shadow-sm hover:border-amber-500/30 transition-all group">
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto bg-muted/50 p-1 rounded-2xl border border-border/50 h-14">
          <TabsTrigger value="overview" className="sm:flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">{t.dashboard.loyalty.overview}</TabsTrigger>
          <TabsTrigger value="rewards" className="sm:flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">{t.dashboard.loyalty.rewards}</TabsTrigger>
          <TabsTrigger value="tiers" className="sm:flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">{t.dashboard.loyalty.tiers}</TabsTrigger>
          <TabsTrigger value="activity" className="sm:flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-sm transition-all">{t.dashboard.loyalty.activity}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:border-amber-500/30 transition-all">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Sparkles className="w-5 h-5 text-amber-500" /></div>
                {program?.name || t.dashboard.loyalty.programName}
              </h3>
              <div className="space-y-4">
                {[
                    [t.dashboard.loyalty.status, <Badge key="s" className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 shadow-sm">Active</Badge>],
                    [t.dashboard.loyalty.pointsPer, <span key="1" className="font-extrabold text-foreground">{program?.pointsPerRupiah || 1}</span>],
                    [t.dashboard.loyalty.minPurchase, <span key="2" className="font-extrabold text-foreground">{formatCurrency(program?.minimumPurchase || 0, currency)}</span>],
                    [t.dashboard.loyalty.maxPerOrder, <span key="3" className="font-extrabold text-foreground">{program?.maximumPointsPerOrder || t.dashboard.loyalty.unlimited}</span>],
                  ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between items-center p-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <span className="text-sm font-medium text-muted-foreground">{label as string}</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:border-amber-500/30 transition-all">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Gift className="w-5 h-5 text-emerald-500" /></div>
                {t.dashboard.loyalty.availableRewards}
              </h3>
              <div className="space-y-2">
                {rewards.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-foreground truncate group-hover:text-amber-600 transition-colors">{r.name}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{{ DISCOUNT: t.dashboard.loyalty.discount, FREE_ITEM: t.dashboard.loyalty.freeItem, VOUCHER: t.dashboard.loyalty.voucher, EXCLUSIVE_ACCESS: t.dashboard.loyalty.exclusiveAccess }[r.rewardType]}</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-bold border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 shrink-0 ml-4 px-3 py-1 shadow-sm">{r.pointsRequired} {t.dashboard.loyalty.pointsLabel}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:border-amber-500/30 transition-all">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Users className="w-5 h-5 text-blue-500" /></div>
                {t.dashboard.loyalty.topMembers}
              </h3>
              <div className="space-y-2">
                {mockTopCustomers.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : i === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : i === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                      <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                    </div>
                    <span className="text-sm font-extrabold text-foreground shrink-0 ml-4">{c.points} <span className="text-xs font-medium text-muted-foreground">{t.dashboard.loyalty.pointsLabel}</span></span>
                  </div>
                ))}
                {mockTopCustomers.length === 0 && (
                   <p className="text-sm font-medium text-muted-foreground text-center py-8">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(r => (
              <div key={r.id} className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col group">
                <div className="flex items-start justify-between mb-6">
                  <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider bg-background shadow-sm border-border/50">{{ DISCOUNT: t.dashboard.loyalty.discount, FREE_ITEM: t.dashboard.loyalty.freeItem, VOUCHER: t.dashboard.loyalty.voucher, EXCLUSIVE_ACCESS: t.dashboard.loyalty.exclusiveAccess }[r.rewardType]}</Badge>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
                    <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-xl font-extrabold text-foreground leading-tight group-hover:text-amber-600 transition-colors mb-2">{r.name}</p>
                <p className="text-sm font-medium text-muted-foreground mb-6 line-clamp-2 flex-1">{r.description || t.dashboard.loyalty.noDescription}</p>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Required</span>
                   <Badge className="text-sm font-extrabold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 px-4 py-1.5 shadow-sm border">{r.pointsRequired} {t.dashboard.loyalty.pointsLabel}</Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map(tier => (
              <div key={tier.name} className={`${tier.bg} border ${tier.border} rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-background flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform ${tier.border} border`}>
                     <tier.icon className={`w-10 h-10 ${tier.color}`} />
                  </div>
                  <p className={`text-2xl font-extrabold tracking-tight mb-2 ${tier.color}`}>{tierNameMap[tier.name]}</p>
                  <p className="text-sm font-bold text-muted-foreground flex items-center justify-center gap-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {tier.minPoints}+ points
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                  </p>
                  <Separator className="my-6 border-current opacity-20" />
                  <p className="text-base font-medium text-foreground">{tierPerksMap[tier.perks]}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm overflow-hidden">
            <div className="divide-y divide-border/50">
              {mockTransactions.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-4 first:pt-2 last:pb-2 gap-4 hover:bg-muted/30 -mx-6 px-6 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0 shadow-sm ${t.type === 'EARNED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                      {t.type === 'EARNED' ? '+' : '-'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-foreground truncate mb-1">{t.customer}</p>
                      <p className="text-sm font-medium text-muted-foreground truncate">{t.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xl font-extrabold mb-1 ${t.type === 'EARNED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {t.type === 'EARNED' ? '+' : '-'}{t.points}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">{t.date}</p>
                  </div>
                </div>
              ))}
              {mockTransactions.length === 0 && (
                 <p className="text-sm font-medium text-muted-foreground text-center py-12">No recent activity</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={programDialog} onOpenChange={setProgramDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.dashboard.loyalty.programSettings}</DialogTitle>
            <DialogDescription className="text-sm font-medium">{t.dashboard.loyalty.configureRules}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.loyalty.pointsPerDollar}</Label><Input type="number" value={progForm.pointsPerRupiah} onChange={e => setProgForm(p => ({ ...p, pointsPerRupiah: Number(e.target.value) }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" /></div>
            <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.loyalty.minimumPurchase}</Label><Input type="number" value={progForm.minimumPurchase} onChange={e => setProgForm(p => ({ ...p, minimumPurchase: Number(e.target.value) }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" /></div>
            <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.loyalty.maxPointsPerOrder} ({t.dashboard.loyalty.zeroUnlimited})</Label><Input type="number" value={progForm.maximumPointsPerOrder} onChange={e => setProgForm(p => ({ ...p, maximumPointsPerOrder: Number(e.target.value) }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" /></div>
          </div>
          <DialogFooter className="gap-3 sm:gap-0 pt-4 border-t border-border/50">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setProgramDialog(false)}>{t.dashboard.loyalty.cancel}</Button>
            <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" onClick={handleSaveProgram} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t.dashboard.loyalty.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
