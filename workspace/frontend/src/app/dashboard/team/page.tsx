'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useStaff, StaffMember } from '@/hooks/useStaff';
import { Plus, Search, Mail, Shield, MoreHorizontal, UserCircle, Check, X, Loader2 } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin', MANAGER: 'Manager', WAITER: 'Waiter', CHEF: 'Chef', CASHIER: 'Cashier',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  MANAGER: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  WAITER: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  CHEF: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  CASHIER: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
};

export default function TeamPage() {
  const { t } = useI18n();
  const roleLabels: Record<string, string> = {
    ADMIN: t.dashboard.team.roles.admin,
    MANAGER: t.dashboard.team.roles.manager,
    WAITER: t.dashboard.team.roles.waiter,
    CHEF: t.dashboard.team.roles.chef,
    CASHIER: t.dashboard.team.roles.cashier,
  };
  const { staff, loading, error, fetchStaff, createStaff, updateStaff, deleteStaff } = useStaff();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: 'WAITER' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const filtered = staff.filter(s => {
    const name = s.user?.name?.toLowerCase() || '';
    const email = s.user?.email?.toLowerCase() || '';
    const q = search.toLowerCase();
    return (name.includes(q) || email.includes(q)) && (!roleFilter || s.roleId === roleFilter);
  });

  const handleOpen = (member?: StaffMember) => {
    if (member) {
      setEditing(member);
      setForm({ name: member.user?.name || '', email: member.user?.email || '', password: '', roleId: member.roleId });
    } else {
      setEditing(null);
      setForm({ name: '', email: '', password: '', roleId: 'WAITER' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) await updateStaff(editing.id, { roleId: form.roleId as StaffMember['roleId'] });
      else await createStaff({ ...form, roleId: form.roleId as StaffMember['roleId'] });
      setDialogOpen(false);
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t.dashboard.team.confirmRemove)) await deleteStaff(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.team.teamMembers}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.team.teamSubtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl hover:scale-105 transition-all"><Plus className="w-5 h-5 mr-2" /> {t.dashboard.team.addMember}</Button>} />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{editing ? t.dashboard.team.dialog.editTitle : t.dashboard.team.dialog.addTitle}</DialogTitle>
              <DialogDescription className="text-sm font-medium">{editing ? t.dashboard.team.dialog.editDesc : t.dashboard.team.dialog.addDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              {!editing && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.dashboard.team.dialog.fullName}</Label>
                    <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.dashboard.team.dialog.namePlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.dashboard.team.dialog.email}</Label>
                    <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.dashboard.team.dialog.emailPlaceholder} type="email" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.dashboard.team.dialog.password}</Label>
                    <Input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder={t.dashboard.team.dialog.passwordPlaceholder} type="password" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.dashboard.team.dialog.role}</Label>
                <Select value={form.roleId} onValueChange={v => setForm(p => ({ ...p, roleId: v }))}>
                  <SelectTrigger className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k} className="font-medium">{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-11 px-6 font-semibold rounded-xl border-border/50">{t.dashboard.team.dialog.cancel}</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? t.dashboard.team.dialog.update : t.dashboard.team.dialog.addMember}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card rounded-3xl border border-border/50 p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-12 h-12 bg-muted/30 border-0 focus-visible:ring-amber-500 rounded-2xl font-medium w-full" placeholder={t.dashboard.team.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/30 border-0 focus:ring-amber-500 rounded-2xl font-semibold"><SelectValue placeholder={t.dashboard.team.allRoles} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t.dashboard.team.allRoles}</SelectItem>
            {Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k} className="font-medium">{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-rose-500 text-sm font-bold">{error}</p>
          <Button variant="outline" onClick={fetchStaff} className="h-11 px-6 rounded-xl border-border/50">{t.dashboard.team.retry}</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border/50 rounded-3xl">
          <UserCircle className="w-16 h-16 mb-4 opacity-50" />
          <p className="font-bold text-lg text-foreground mb-1">{t.dashboard.team.noMembers}</p>
          <p className="text-sm font-medium">{t.dashboard.team.noMembersDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(member => (
            <div key={member.id} className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:scale-110 transition-transform shrink-0">
                    {(member.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-foreground truncate group-hover:text-amber-600 transition-colors">{member.user?.name || t.dashboard.team.unknown}</p>
                    <p className="text-sm font-medium text-muted-foreground truncate">{member.user?.email || t.dashboard.team.noEmail}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                 <Badge variant="outline" className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-0 shadow-sm ${ROLE_COLORS[member.roleId] || 'bg-muted text-muted-foreground'}`}>
                  <Shield className="w-3.5 h-3.5 mr-1.5 inline" />{roleLabels[member.roleId] || member.roleId}
                </Badge>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm font-bold">
                  {member.isActive ? (
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-md"><Check className="w-4 h-4 mr-1.5" />{t.dashboard.team.status.active}</span>
                  ) : (
                    <span className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-md"><X className="w-4 h-4 mr-1.5" />{t.dashboard.team.status.inactive}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-muted" onClick={() => handleOpen(member)}>
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" className="font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-4 h-10 rounded-xl" onClick={() => handleDelete(member.id)}>
                    {t.dashboard.team.actions.remove}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
