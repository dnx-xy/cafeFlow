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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.team.teamMembers}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.team.teamSubtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> {t.dashboard.team.addMember}</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? t.dashboard.team.dialog.editTitle : t.dashboard.team.dialog.addTitle}</DialogTitle>
              <DialogDescription>{editing ? t.dashboard.team.dialog.editDesc : t.dashboard.team.dialog.addDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!editing && (
                <>
                  <div className="space-y-2">
                    <Label>{t.dashboard.team.dialog.fullName}</Label>
                    <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.dashboard.team.dialog.namePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.dashboard.team.dialog.email}</Label>
                    <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.dashboard.team.dialog.emailPlaceholder} type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.dashboard.team.dialog.password}</Label>
                    <Input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder={t.dashboard.team.dialog.passwordPlaceholder} type="password" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>{t.dashboard.team.dialog.role}</Label>
                <Select value={form.roleId} onValueChange={v => setForm(p => ({ ...p, roleId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t.dashboard.team.dialog.cancel}</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? t.dashboard.team.dialog.update : t.dashboard.team.dialog.addMember}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-9 h-9 text-sm" placeholder={t.dashboard.team.search} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder={t.dashboard.team.allRoles} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t.dashboard.team.allRoles}</SelectItem>
            {Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <p className="text-red-500 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchStaff}>{t.dashboard.team.retry}</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
          <UserCircle className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium text-sm">{t.dashboard.team.noMembers}</p>
          <p className="text-xs">{t.dashboard.team.noMembersDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(member => (
            <div key={member.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(member.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{member.user?.name || t.dashboard.team.unknown}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.user?.email || t.dashboard.team.noEmail}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${ROLE_COLORS[member.roleId] || ''}`}>
                  <Shield className="w-3 h-3 mr-1 inline" />{roleLabels[member.roleId] || member.roleId}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {member.isActive ? (
                    <span className="flex items-center text-green-600 dark:text-green-400"><Check className="w-3 h-3 mr-1" />{t.dashboard.team.status.active}</span>
                  ) : (
                    <span className="flex items-center text-red-600 dark:text-red-400"><X className="w-3 h-3 mr-1" />{t.dashboard.team.status.inactive}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleOpen(member)}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-red-600 dark:text-red-400 h-7" onClick={() => handleDelete(member.id)}>
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
