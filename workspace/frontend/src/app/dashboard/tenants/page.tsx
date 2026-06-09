'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  Search, Plus, Users, Building, Store, Globe, Shield, Mail, Clock, QrCode, Zap, Download, Coffee,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { tenantsService, Tenant } from '@/services/tenantsService';
import { authService } from '@/services/authService';

interface TenantWithStats extends Tenant {
  email?: string;
  phone?: string;
  plan?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  users?: number;
  orders?: number;
  revenue?: number;
  businessId?: string;
  logoUrl?: string;
  qrCode?: { code: string; id: string };
}

const CANVAS_FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

export default function TenantsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantWithStats[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [viewingQr, setViewingQr] = useState<{ code: string; name: string; businessId?: string; tenantId?: string } | null>(null);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const [realForm, setRealForm] = useState({
    name: '',
    slug: '',
    email: '',
    password: '',
    businessName: '',
  });

  const [quickForm, setQuickForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const tenantsData = await tenantsService.getTenants();
      const tenantsWithStats: TenantWithStats[] = tenantsData.map((tenant: any, index) => ({
        ...tenant,
        email: tenant.type === 'quick' ? '' : `admin@${tenant.slug}.com`,
        phone: tenant.type === 'quick' ? '' : `+1 (555) ${String(100 + index * 111).padStart(3, '0')}-${String(1000 + index * 1111).slice(-4)}`,
        plan: tenant.type === 'quick' ? 'Quick' : index === 0 ? 'Pro' : index === 1 ? 'Enterprise' : 'Starter',
        status: 'ACTIVE',
        createdAt: tenant.createdAt ? new Date(tenant.createdAt).toISOString().split('T')[0] : new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: tenant.type === 'quick' ? 1 : 5 + index * 4,
        orders: tenant.type === 'quick' ? 0 : 890 + index * 780,
        revenue: tenant.type === 'quick' ? 0 : 17800 + index * 15500,
      }));
      setTenants(tenantsWithStats);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      toast.error(t.dashboard.tenants.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    (tenant.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    tenant.slug.toLowerCase().includes(search.toLowerCase()) ||
    tenant.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSwitchTenant = async (tenantId: string) => {
    try {
      const response = await authService.switchTenant(tenantId);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      const tenantName = tenants.find(t => t.id === tenantId)?.name || tenantId;
      toast.success(t.dashboard.tenants.switchedTo.replace('{{name}}', tenantName));
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Tenant switch error:', error);
      toast.error(t.dashboard.tenants.failedToSwitch);
    }
  };

  const handleCreateRealTenant = async () => {
    if (!realForm.name || !realForm.slug || !realForm.email || !realForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setCreating(true);
      await tenantsService.createRealTenant({
        name: realForm.name,
        slug: realForm.slug,
        email: realForm.email,
        password: realForm.password,
        businessName: realForm.businessName || undefined,
      });
      toast.success(t.dashboard.tenants.created);
      setShowCreateDialog(false);
      setRealForm({ name: '', slug: '', email: '', password: '', businessName: '' });
      fetchTenants();
    } catch (error) {
      console.error('Create real tenant error:', error);
      toast.error(t.dashboard.tenants.createFailed);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateQuickTenant = async () => {
    if (!quickForm.name || !quickForm.email || !quickForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setCreating(true);
      const result = await tenantsService.createQuickTenant({
        name: quickForm.name,
        email: quickForm.email,
        password: quickForm.password,
      });
      setViewingQr({ code: result.qrCode.code, name: quickForm.name });
      setShowCreateDialog(false);
      setQuickForm({ name: '', email: '', password: '' });
      fetchTenants();
    } catch (error) {
      console.error('Create quick tenant error:', error);
      toast.error(t.dashboard.tenants.createFailed);
    } finally {
      setCreating(false);
    }
  };

  const drawPaymentIcon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, bgColor: string, text: string, textColor: string) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = size * 0.3;
    ctx.shadowOffsetY = size * 0.1;
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, size * 0.25);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = textColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `700 ${size * 0.35}px ${CANVAS_FONT_STACK}`;
    ctx.fillText(text, x + size / 2, y + size / 2);
    ctx.restore();
  };

  const handleDownloadQr = () => {
    if (!viewingQr || !qrCanvasRef.current) return;
    try {
      const qrCanvas = qrCanvasRef.current;
      const S = 3;
      const W = 360 * S;
      const H = 560 * S;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const fontStack = CANVAS_FONT_STACK;

      // Light gradient background (subtle)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#fafafa');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';
      let yPos = 24 * S;

      // --- Top: CafeFlow Provider Badge (QRIS-style) ---
      // Orange accent bar at very top
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 0, W, 4 * S);

      // CafeFlow branding row with compact badge
      const badgeH = 26 * S;
      const badgeW = 110 * S;
      const badgeX = (W - badgeW) / 2;
      
      // Badge background
      const badgeGrad = ctx.createLinearGradient(badgeX, yPos, badgeX + badgeW, yPos + badgeH);
      badgeGrad.addColorStop(0, '#f97316');
      badgeGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = badgeGrad;
      ctx.beginPath();
      ctx.roundRect(badgeX, yPos, badgeW, badgeH, 6 * S);
      ctx.fill();

      // Coffee icon in badge
      ctx.save();
      const badgeIconS = 13 * S;
      const iconX = badgeX + 10 * S;
      const iconY = yPos + (badgeH - badgeIconS) / 2;
      const scale = badgeIconS / 24;
      ctx.translate(iconX, iconY);
      ctx.scale(scale, scale);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(new Path2D('M10 2v2'));
      ctx.stroke(new Path2D('M14 2v2'));
      ctx.stroke(new Path2D('M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1'));
      ctx.stroke(new Path2D('M6 2v2'));
      ctx.restore();

      // CafeFlow text in badge
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${12 * S}px ${fontStack}`;
      ctx.fillText('CAFEFLOW', iconX + badgeIconS + 6 * S, yPos + badgeH / 2);
      
      yPos += badgeH + 24 * S;

      // --- Business Name (Large, Anton font, QRIS-style merchant name) ---
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0a0a0a';
      ctx.font = `400 ${32 * S}px 'Anton', sans-serif`;
      ctx.fillText(viewingQr.name.toUpperCase(), W / 2, yPos);
      yPos += 32 * S + 6 * S;

      // Merchant ID / Location (subtle)
      ctx.fillStyle = '#737373';
      ctx.font = `500 ${9 * S}px ${fontStack}`;
      ctx.fillText(`MERCHANT ID: ${viewingQr.code.slice(-8).toUpperCase()}`, W / 2, yPos);
      yPos += 9 * S + 24 * S;

      // --- QR Code Container (QRIS-style: clean white box, no inner border) ---
      const qrSize = 220 * S;
      const qrX = (W - qrSize) / 2;
      const qrPad = 16 * S;
      const qrBoxSize = qrSize + 2 * qrPad;

      // White QR container with subtle shadow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 24 * S;
      ctx.shadowOffsetY = 6 * S;
      ctx.beginPath();
      ctx.roundRect((W - qrBoxSize) / 2, yPos, qrBoxSize, qrBoxSize, 12 * S);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // QR code centered (no border around barcode)
      ctx.drawImage(qrCanvas, qrX, yPos + qrPad, qrSize, qrSize);
      yPos += qrBoxSize + 20 * S;

      // --- Instructions (QRIS-style clear CTA) ---
      ctx.fillStyle = '#171717';
      ctx.font = `600 ${13 * S}px ${fontStack}`;
      ctx.fillText('SCAN QR UNTUK PESAN & BAYAR', W / 2, yPos);
      yPos += 13 * S + 10 * S;

      // --- Supported Payment Methods (QRIS-style icons) ---
      ctx.fillStyle = '#a3a3a3';
      ctx.font = `400 ${9 * S}px ${fontStack}`;
      ctx.fillText('Metode pembayaran yang didukung', W / 2, yPos);
      yPos += 9 * S + 12 * S;

      const iconSize = 28 * S;
      const iconGap = 12 * S;
      const totalIconsW = 4 * iconSize + 3 * iconGap;
      const iconStartX = (W - totalIconsW) / 2;

      drawPaymentIcon(ctx, iconStartX, yPos, iconSize, '#ee4d2d', 'SP', '#ffffff');
      drawPaymentIcon(ctx, iconStartX + iconSize + iconGap, yPos, iconSize, '#0088cc', 'DA', '#ffffff');
      drawPaymentIcon(ctx, iconStartX + 2 * (iconSize + iconGap), yPos, iconSize, '#00a340', 'GP', '#ffffff');
      drawPaymentIcon(ctx, iconStartX + 3 * (iconSize + iconGap), yPos, iconSize, '#1a237e', 'TF', '#ffffff');
      yPos += iconSize + 24 * S;

      // --- Bottom: Provider info (QRIS-style footer) ---
      // Divider line
      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1 * S;
      ctx.beginPath();
      ctx.moveTo(30 * S, yPos);
      ctx.lineTo(W - 30 * S, yPos);
      ctx.stroke();
      yPos += 14 * S;

      // Website
      ctx.fillStyle = '#a3a3a3';
      ctx.font = `500 ${9 * S}px ${fontStack}`;
      ctx.fillText('www.cafeflow.com', W / 2, yPos);
      yPos += 9 * S + 8 * S;

      // Powered by text
      ctx.font = `400 ${8 * S}px ${fontStack}`;
      ctx.fillStyle = '#d4d4d4';
      ctx.fillText('Didukung oleh CafeFlow Digital Payment System', W / 2, yPos);

      const a = document.createElement('a');
      a.download = `${viewingQr.name.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      toast.success('QR code downloaded');
    } catch {
      toast.error('Failed to generate QR image');
    }
  };

  const handleViewQr = async (tenant: TenantWithStats) => {
    if (tenant.qrCode) {
      setViewingQr({ code: tenant.qrCode.code, name: tenant.name });
    } else if (tenant.businessId) {
      try {
        const result = await tenantsService.generateBusinessQr();
        setViewingQr({ code: result.code, name: tenant.name });
        tenant.qrCode = { code: result.code, id: result.id };
      } catch {
        toast.error('Failed to generate QR code');
      }
    } else {
      toast.error('No business associated with this tenant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.tenants.tenantsManagement}</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.tenants.tenantsSubtitle}</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl hover:scale-105 transition-all">
          <Plus className="w-5 h-5 mr-2" /> {t.dashboard.tenants.createTenant}
        </Button>
      </div>

      {/* Create Tenant Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">{t.dashboard.tenants.createTenant}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Choose the type of tenant to create
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Real Tenant Card */}
            <div className="border border-border/50 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/10 transition-all cursor-pointer bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{t.dashboard.tenants.createRealTenant}</div>
                  <div className="text-xs font-medium text-muted-foreground">{t.dashboard.tenants.realTenantDesc}</div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <Input value={realForm.name} onChange={e => setRealForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={t.dashboard.tenants.formNamePlaceholder} className="h-10 bg-muted/30 border-0 focus-visible:ring-amber-500 text-sm" />
                <div className="flex gap-2">
                  <Input value={realForm.slug} onChange={e => setRealForm(p => ({ ...p, slug: e.target.value }))}
                    placeholder={t.dashboard.tenants.formSlugPlaceholder} className="h-10 bg-muted/30 border-0 focus-visible:ring-amber-500 text-sm flex-1" />
                  <Input value={realForm.businessName} onChange={e => setRealForm(p => ({ ...p, businessName: e.target.value }))}
                    placeholder={t.dashboard.tenants.formBusinessNamePlaceholder} className="h-10 bg-muted/30 border-0 focus-visible:ring-amber-500 text-sm flex-1" />
                </div>
                <Input value={realForm.email} onChange={e => setRealForm(p => ({ ...p, email: e.target.value }))}
                  placeholder={t.dashboard.tenants.formEmailPlaceholder} type="email" className="h-10 bg-muted/30 border-0 focus-visible:ring-amber-500 text-sm" />
                <Input value={realForm.password} onChange={e => setRealForm(p => ({ ...p, password: e.target.value }))}
                  placeholder={t.dashboard.tenants.formPassword} type="password" className="h-10 bg-muted/30 border-0 focus-visible:ring-amber-500 text-sm" />
                <Button onClick={handleCreateRealTenant} disabled={creating}
                  className="w-full h-10 font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md shadow-amber-500/20 mt-2">
                  {creating ? t.dashboard.tenants.creating : t.dashboard.tenants.createRealTenant}
                </Button>
              </div>
            </div>

            {/* Quick Tenant Card */}
            <div className="border border-border/50 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{t.dashboard.tenants.createQuickTenant}</div>
                  <div className="text-xs font-medium text-muted-foreground">{t.dashboard.tenants.quickTenantDesc}</div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <Input value={quickForm.name} onChange={e => setQuickForm(p => ({ ...p, name: e.target.value }))}
                  placeholder={t.dashboard.tenants.formNamePlaceholder} className="h-10 bg-muted/30 border-0 focus-visible:ring-emerald-500 text-sm" />
                <Input value={quickForm.email} onChange={e => setQuickForm(p => ({ ...p, email: e.target.value }))}
                  placeholder={t.dashboard.tenants.formEmailPlaceholder} type="email" className="h-10 bg-muted/30 border-0 focus-visible:ring-emerald-500 text-sm" />
                <Input value={quickForm.password} onChange={e => setQuickForm(p => ({ ...p, password: e.target.value }))}
                  placeholder={t.dashboard.tenants.formPassword} type="password" className="h-10 bg-muted/30 border-0 focus-visible:ring-emerald-500 text-sm" />
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  <QrCode className="w-3.5 h-3.5" />
                  QR code will be shown after creation
                </div>
                <Button onClick={handleCreateQuickTenant} disabled={creating}
                  className="w-full h-10 font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/20 mt-2">
                  {creating ? t.dashboard.tenants.creating : t.dashboard.tenants.createQuickTenant}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Result Dialog */}
      <Dialog open={viewingQr !== null} onOpenChange={open => { if (!open) setViewingQr(null); }}>
        <DialogContent className="sm:max-w-sm">
          {viewingQr && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div ref={qrCardRef} style={{ width: 360, background: '#fff', borderRadius: 16, border: '1px solid #eee', padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* CafeFlow Logo & Branding */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 2 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Coffee className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: '28px' }}>CafeFlow</span>
                </div>
                <span style={{ fontSize: 9, color: '#999', fontWeight: 400, marginTop: 1, marginBottom: 2 }}>Serving your business, digitally.</span>
                <span style={{ fontSize: 8, color: '#bbb', fontWeight: 500, marginBottom: 10, letterSpacing: 0.3 }}>www.cafeflow.com</span>

                {/* Divider */}
                <div style={{ width: '70%', height: 1, background: '#eee', marginBottom: 10 }} />

                {/* Tenant Name */}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 12, textAlign: 'center', lineHeight: '18px', fontFamily: 'var(--font-anton), sans-serif' }}>{viewingQr.name}</span>

                {/* QR Code */}
                <div style={{ width: 220, height: 220, background: '#fff', borderRadius: 14, border: '2px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <QRCodeSVG value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingQr.code}`} size={200} level="M" />
                </div>

                {/* Call to Action */}
                <span style={{ fontSize: 11, color: '#888', textAlign: 'center', fontWeight: 600, letterSpacing: 0.4 }}>Scan to order &amp; pay</span>
              </div>
              <QRCodeCanvas ref={qrCanvasRef} value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingQr.code}`} size={660} level="M" style={{ position: 'absolute', left: -9999, top: -9999 }} />
              <Button className="h-11 px-6 font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 w-full mt-1" onClick={handleDownloadQr}>
                <Download className="w-4 h-4 mr-2" />Download QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-3xl border border-border/50 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t.dashboard.tenants.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 h-12 bg-muted/30 border-0 focus-visible:ring-amber-500 rounded-2xl font-medium w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-border/50 shadow-sm bg-card rounded-3xl">
            <CardHeader className="pb-4 border-b border-border/50 px-6 sm:px-8 pt-6 sm:pt-8">
              <CardTitle className="text-xl font-bold text-foreground">
                {t.dashboard.tenants.activeTenants}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredTenants.map(tenant => (
                    <div key={tenant.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 hover:bg-muted/30 transition-colors gap-6 group">
                        <div className="flex items-center gap-5">
                          {tenant.logoUrl ? (
                            <img src={tenant.logoUrl} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform shrink-0" />
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:scale-110 transition-transform shrink-0 ${tenant.type === 'quick' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                              {tenant.type === 'quick' ? <Zap className="w-6 h-6" /> : tenant.name.charAt(0)}
                            </div>
                          )}
                        <div>
                          <p className="text-lg font-bold text-foreground group-hover:text-amber-600 transition-colors">{tenant.name}</p>
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-0.5">
                            {tenant.type === 'quick' ? <Zap className="w-3.5 h-3.5 text-emerald-500" /> : <Store className="w-3.5 h-3.5" />}
                            {tenant.type === 'quick' ? 'Quick Tenant' : 'Full Tenant'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pl-19 sm:pl-0">
                        <div className="text-left sm:text-right">
                          {tenant.type === 'quick' ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg">QR Ready</span>
                          ) : (
                            <>
                              <p className="text-base font-bold text-foreground">{t.dashboard.tenants.orders.replace('{{count}}', (tenant.orders?.toLocaleString() || '0'))}</p>
                              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t.dashboard.tenants.revenue.replace('{{amount}}', (tenant.revenue?.toLocaleString() || '0'))}</p>
                            </>
                          )}
                        </div>
                        {tenant.type === 'quick' ? (
                          <Button
                            variant="outline"
                            className="h-10 px-5 rounded-xl font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors"
                            onClick={() => handleViewQr(tenant)}
                          >
                            <QrCode className="w-4 h-4 mr-2" /> View QR
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-10 px-5 rounded-xl font-semibold border-border/50 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors"
                            onClick={() => handleSwitchTenant(tenant.id)}
                          >
                            {t.dashboard.tenants.switchTenant}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredTenants.length === 0 && !loading && (
                    <div className="text-center py-16">
                      <Building className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-lg font-bold text-foreground mb-2">{t.dashboard.tenants.noTenants}</p>
                      <p className="text-sm font-medium text-muted-foreground">Add a new tenant to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-border/50 shadow-sm bg-card rounded-3xl">
            <CardHeader className="pb-4 border-b border-border/50 px-6 sm:px-8 pt-6 sm:pt-8">
              <CardTitle className="text-xl font-bold text-foreground">
                {t.dashboard.tenants.tenantStatistics}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shadow-sm">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.dashboard.tenants.totalTenants}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-foreground">{tenants.length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shadow-sm">
                      <Building className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.dashboard.tenants.activeBusinesses}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-foreground">{tenants.filter(t => t.status === 'ACTIVE').length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/30 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider">{t.dashboard.tenants.totalRevenue}</span>
                  </div>
                  <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                    ${tenants.reduce((sum, t) => sum + (t.revenue || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm bg-card rounded-3xl">
            <CardHeader className="pb-4 border-b border-border/50 px-6 sm:px-8 pt-6 sm:pt-8">
              <CardTitle className="text-xl font-bold text-foreground">
                {t.dashboard.tenants.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-base font-semibold border-border/50 hover:bg-muted/50 hover:text-amber-600 transition-colors">
                  <Shield className="w-5 h-5 mr-3" /> {t.dashboard.tenants.actions.security}
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-base font-semibold border-border/50 hover:bg-muted/50 hover:text-amber-600 transition-colors">
                  <Mail className="w-5 h-5 mr-3" /> {t.dashboard.tenants.actions.notification}
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-base font-semibold border-border/50 hover:bg-muted/50 hover:text-amber-600 transition-colors">
                  <Clock className="w-5 h-5 mr-3" /> {t.dashboard.tenants.actions.maintenance}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}