'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Badge } from '@/components/ui/badge';
import { Save, Store, Clock, Bell, Loader2, Image } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '', logoUrl: '' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user?.businessId) {
      fetchBusiness(user.businessId);
    }
  }, [user?.businessId]);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || '',
        description: business.description || '',
        address: business.address || '',
        city: business.city || '',
        logoUrl: business.logoUrl || '',
      });
    }
  }, [business]);

  const handleSave = async () => {
    if (!user?.businessId || !business) return;
    setSaving(true);
    try {
      await updateBusiness(user.businessId, form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your business profile and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="general" className="sm:flex-1"><Store className="w-4 h-4 mr-2" /> General</TabsTrigger>
          <TabsTrigger value="hours" className="sm:flex-1"><Clock className="w-4 h-4 mr-2" /> Hours</TabsTrigger>
          <TabsTrigger value="notifications" className="sm:flex-1"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
            </div>
          ) : (
            <>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Business Information</CardTitle>
                  <CardDescription>Update your café details displayed to customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Business Name</Label>
                      <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Logo URL</Label>
                      <Input value={form.logoUrl} onChange={e => setForm(p => ({ ...p, logoUrl: e.target.value }))} placeholder="https://example.com/logo.png" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Branding</CardTitle>
                  <CardDescription>Customize your digital presence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
                      {form.logoUrl ? (
                        <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Image className="w-8 h-8" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{form.name || 'Your Business'}</p>
                      <p className="text-xs text-muted-foreground">{form.city || 'No city set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Operating Hours</CardTitle>
              <CardDescription>Set your café&apos;s opening and closing times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operatingHours.map(h => (
                  <div key={h.day} className="flex items-center justify-between py-2 border-b last:border-0 gap-3">
                    <span className="text-sm font-medium w-20 md:w-28 shrink-0">{h.day}</span>
                    <div className="flex items-center gap-2">
                      <Input className="w-20 md:w-24 text-center" defaultValue={h.open} type="time" />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input className="w-20 md:w-24 text-center" defaultValue={h.close} type="time" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
              <CardDescription>Choose which updates you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'New Orders', desc: 'When a customer places a new order' },
                  { label: 'Order Updates', desc: 'When order status changes' },
                  { label: 'New Reviews', desc: 'When customers leave feedback' },
                  { label: 'Low Stock Alerts', desc: 'When inventory runs low' },
                  { label: 'Daily Reports', desc: 'End of day sales summary' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-2 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 bg-green-50 shrink-0">Enabled</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
