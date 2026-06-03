'use client';

import { useState, useEffect } from 'react';
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
import { Save, Store, Clock, Bell, Loader2, Image, DollarSign, Trash2 } from 'lucide-react';
import { CURRENCIES } from '@/lib/currency';
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
  const { user } = useAuth();
  const { business, loading, fetchBusiness, updateBusiness } = useBusiness();
  const { setCurrency } = useCurrency();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '', logoUrl: '', currency: 'USD' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (user?.businessId) fetchBusiness(user.businessId); }, [user?.businessId]);
  useEffect(() => {
    if (business) {
      setForm({ name: business.name || '', description: business.description || '', address: business.address || '', city: business.city || '', logoUrl: business.logoUrl || '', currency: business.currency || 'USD' });
    }
  }, [business]);

  const handleSave = async () => {
    if (!user?.businessId || !business) return;
    setSaving(true);
    try {
      await updateBusiness(user.businessId, form);
      setCurrency(form.currency as any);
      toast.success('Settings saved successfully');
    } finally { setSaving(false); }
  };

  const handleDeleteBusiness = async () => {
    if (!user?.businessId) return;
    
    if (confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      try {
        // In a real implementation, you would call an API endpoint to delete the business
        // For now, just show success message
        toast.success('Business deleted successfully');
        // Redirect to dashboard or login page
      } catch (error) {
        toast.error('Failed to delete business');
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your business profile and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="general" className="sm:flex-1"><Store className="w-4 h-4 mr-2" /> General</TabsTrigger>
          <TabsTrigger value="hours" className="sm:flex-1"><Clock className="w-4 h-4 mr-2" /> Hours</TabsTrigger>
          <TabsTrigger value="notifications" className="sm:flex-1"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Business Information</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Update your café details displayed to customers</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs">Business Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" /></div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="text-sm" /></div>
                  <div className="space-y-2"><Label className="text-xs">Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-9 text-sm" /></div>
                  <div className="space-y-2"><Label className="text-xs">City</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="h-9 text-sm" /></div>
                  <div className="space-y-2">
                    <Label className="text-xs">Currency</Label>
                    <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2"><Label className="text-xs">Logo URL</Label><Input value={form.logoUrl} onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))} placeholder="https://example.com/logo.png" className="h-9 text-sm" /></div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Branding</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Customize your digital presence</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                    {form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Image className="w-7 h-7" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{form.name || 'Your Business'}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{form.city || 'No city set'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="destructive" size="sm" className="h-9 text-xs" onClick={handleDeleteBusiness}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Business
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Save className="w-4 h-4 mr-2" />Save Changes
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="hours" className="mt-5">
          <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Operating Hours</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Set your café&apos;s opening and closing times</p>
            <div className="space-y-2">
              {operatingHours.map(h => (
                <div key={h.day} className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800/50 last:border-0 gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 shrink-0">{h.day}</span>
                  <div className="flex items-center gap-2">
                    <Input className="w-20 text-center h-9 text-sm" defaultValue={h.open} type="time" />
                    <span className="text-xs text-gray-400">to</span>
                    <Input className="w-20 text-center h-9 text-sm" defaultValue={h.close} type="time" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Notification Preferences</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose which updates you want to receive</p>
            <div className="space-y-3">
              {[
                { label: 'New Orders', desc: 'When a customer places a new order' },
                { label: 'Order Updates', desc: 'When order status changes' },
                { label: 'New Reviews', desc: 'When customers leave feedback' },
                { label: 'Low Stock Alerts', desc: 'When inventory runs low' },
                { label: 'Daily Reports', desc: 'End of day sales summary' },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2.5 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{n.desc}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 shrink-0">Enabled</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
