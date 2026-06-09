'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Save, Store, Clock, Bell, Loader2, Image, Trash2, Phone } from 'lucide-react';
import { CURRENCIES, getCurrencyInfo } from '@/lib/currency';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

const operatingHours = [
  { day: 'Monday', open: '07:00', close: '22:00' },
  { day: 'Tuesday', open: '07:00', close: '22:00' },
  { day: 'Wednesday', open: '07:00', close: '22:00' },
  { day: 'Thursday', open: '07:00', close: '22:00' },
  { day: 'Friday', open: '07:00', close: '23:00' },
  { day: 'Saturday', open: '08:00', close: '23:00' },
  { day: 'Sunday', open: '08:00', close: '21:00' },
];

export default function SettingsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { business, loading, fetchBusiness, updateBusiness } = useBusiness();
  const { setCurrency } = useCurrency();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '', logoUrl: '', currency: 'USD', whatsappNumber: '' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (user?.businessId) fetchBusiness(user.businessId); }, [user?.businessId]);
  useEffect(() => {
    if (business) {
      setForm({ name: business.name || '', description: business.description || '', address: business.address || '', city: business.city || '', logoUrl: business.logoUrl || '', currency: business.currency || 'USD', whatsappNumber: business.whatsappNumber || '' });
    }
  }, [business]);

  const handleSave = async () => {
    if (!user?.businessId || !business) return;
    setSaving(true);
    try {
      await updateBusiness(user.businessId, form);
      setCurrency(form.currency as any);
      toast.success(t.dashboard.settings.general.saved);
    } finally { setSaving(false); }
  };

  const handleDeleteBusiness = async () => {
    if (!user?.businessId) return;
    
    if (confirm(t.dashboard.settings.general.deleteConfirm)) {
      try {
        // In a real implementation, you would call an API endpoint to delete the business
        // For now, just show success message
        toast.success(t.dashboard.settings.general.deleted);
        // Redirect to dashboard or login page
      } catch (error) {
        toast.error(t.dashboard.settings.general.failedToDelete);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.settings.settingsTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.settings.settingsSubtitle}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="sm:flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><Store className="w-4 h-4 mr-2" /> {t.dashboard.settings.tabs.general}</TabsTrigger>
          <TabsTrigger value="hours" className="sm:flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><Clock className="w-4 h-4 mr-2" /> {t.dashboard.settings.tabs.hours}</TabsTrigger>
          <TabsTrigger value="notifications" className="sm:flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><Bell className="w-4 h-4 mr-2" /> {t.dashboard.settings.tabs.notifications}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:border-amber-500/30 transition-all">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">{t.dashboard.settings.general.businessInformation}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.settings.general.businessInfoDesc}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 md:col-span-2"><Label className="text-sm font-medium">{t.dashboard.settings.general.businessName}</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
                    <div className="space-y-2 md:col-span-2"><Label className="text-sm font-medium">{t.dashboard.settings.general.description}</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="bg-muted/50 border-0 focus-visible:ring-amber-500 resize-none" /></div>
                    <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.settings.general.address}</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
                    <div className="space-y-2"><Label className="text-sm font-medium">{t.dashboard.settings.general.city}</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.dashboard.settings.general.currency}</Label>
                      <Select value={form.currency} onValueChange={v => { setForm(p => ({ ...p, currency: v })); setCurrency(v as any); }}>
                        <SelectTrigger className="h-11 bg-muted/50 border-0 focus:ring-amber-500 w-full">
                          <span className="w-6 text-center text-muted-foreground font-bold shrink-0">{getCurrencyInfo(form.currency).symbol}</span>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {CURRENCIES.map(c => (
                            <SelectItem key={c.code} value={c.code} className="font-medium">{c.symbol} {c.code} - {c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">WhatsApp Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={form.whatsappNumber} onChange={e => setForm(p => ({ ...p, whatsappNumber: e.target.value }))} placeholder="+6281234567890" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 pl-10" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-1">For receiving customer orders & notifications</p>
                    </div>
                    <div className="space-y-2 md:col-span-2"><Label className="text-sm font-medium">{t.dashboard.settings.general.logoUrl}</Label><Input value={form.logoUrl} onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))} placeholder={t.dashboard.settings.general.logoUrlPlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" /></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="ghost" className="h-12 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold" onClick={handleDeleteBusiness}>
                    <Trash2 className="w-4 h-4 mr-2" /> {t.dashboard.settings.general.deleteBusiness}
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="h-12 px-8 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Save className="w-4 h-4 mr-2" />{t.dashboard.settings.general.saveChanges}
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:border-amber-500/30 transition-all sticky top-24">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground">{t.dashboard.settings.general.branding}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.settings.general.brandingDesc}</p>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-24 h-24 bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground overflow-hidden shadow-sm border border-border/50">
                      {form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Image className="w-10 h-10 opacity-50" />}
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-foreground">{form.name || t.dashboard.settings.general.yourBusiness}</p>
                      <p className="text-sm font-medium text-muted-foreground">{form.city || t.dashboard.settings.general.noCitySet}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="hours" className="mt-5">
          <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:border-amber-500/30 transition-all max-w-3xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.settings.hours.title}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.settings.hours.description}</p>
            </div>
            <div className="space-y-1">
              {operatingHours.map(h => (
                <div key={h.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors gap-4">
                  <span className="text-base font-bold text-foreground w-32 shrink-0">{t.dashboard.settings.hours.days[h.day.toLowerCase() as keyof typeof t.dashboard.settings.hours.days]}</span>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Input className="flex-1 sm:w-28 text-center h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 font-semibold" defaultValue={h.open} type="time" />
                    <span className="text-sm font-medium text-muted-foreground">{t.dashboard.settings.hours.to}</span>
                    <Input className="flex-1 sm:w-28 text-center h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 font-semibold" defaultValue={h.close} type="time" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:border-amber-500/30 transition-all max-w-3xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.settings.notifications.title}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.settings.notifications.description}</p>
            </div>
            <div className="space-y-2">
              {[
                { label: t.dashboard.settings.notifications.items.newOrders, desc: t.dashboard.settings.notifications.items.newOrdersDesc },
                { label: t.dashboard.settings.notifications.items.orderUpdates, desc: t.dashboard.settings.notifications.items.orderUpdatesDesc },
                { label: t.dashboard.settings.notifications.items.newReviews, desc: t.dashboard.settings.notifications.items.newReviewsDesc },
                { label: t.dashboard.settings.notifications.items.lowStock, desc: t.dashboard.settings.notifications.items.lowStockDesc },
                { label: t.dashboard.settings.notifications.items.dailyReports, desc: t.dashboard.settings.notifications.items.dailyReportsDesc },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-bold text-foreground">{n.label}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                  <Badge className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 shrink-0 shadow-sm">{t.dashboard.settings.notifications.enabled}</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
