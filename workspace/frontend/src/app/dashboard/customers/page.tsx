'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, MoreHorizontal, Eye, Edit, Trash2, Plus,
  ChevronLeft, ChevronRight, Users, DollarSign, Calendar, Phone, Mail,
  Upload, Download, Loader2,
} from 'lucide-react';
import { useI18n } from '@/i18n/context';
import { useCustomers } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { customersService } from '@/services/customersService';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const { customers, loading, error, fetchCustomers } = useCustomers();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phoneNumber: '' });
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phoneNumber: '' });

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* ───── KPI BENTO GRID ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.dashboard.customers.totalCustomers, value: customers.length, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
          { label: t.dashboard.customers.newThisWeek, value: '24', icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: t.dashboard.customers.totalSpent, value: formatCurrency(12450, currency), icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: t.dashboard.customers.avgVisit, value: '3.2', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-amber-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
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

      <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder={t.dashboard.customers.searchCustomers} value={search} onChange={e => setSearch(e.target.value)} className="pl-12 h-12 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl font-medium" />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-semibold border-border/50" onClick={() => toast.success('Import modal')}><Upload className="w-4 h-4 mr-2" /> {t.dashboard.customers.import}</Button>
          <Button className="h-12 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20" onClick={() => setAddOpen(true)}><Plus className="w-5 h-5 mr-2" /> {t.dashboard.customers.addCustomer}</Button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-16"><p className="text-rose-500 text-sm font-medium mb-4">{error}</p><Button variant="outline" onClick={() => fetchCustomers()}>Retry</Button></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border/50">
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.customer}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.contact}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.visits}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.spent}</th>
                      <th className="text-center font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.loyalty}</th>
                      <th className="text-right font-semibold text-muted-foreground py-4 px-6">{t.dashboard.customers.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm group-hover:scale-110 transition-transform shrink-0">{c.name.charAt(0)}</div>
                            <div>
                              <p className="text-base font-bold text-foreground group-hover:text-amber-600 transition-colors">{c.name}</p>
                              <p className="text-xs font-medium text-muted-foreground mt-0.5">{c.joinDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1.5">
                            <p className="text-sm font-medium text-muted-foreground flex items-center"><Mail className="w-3.5 h-3.5 mr-2 opacity-50" />{c.email || '-'}</p>
                            <p className="text-sm font-medium text-muted-foreground flex items-center"><Phone className="w-3.5 h-3.5 mr-2 opacity-50" />{c.phoneNumber || '-'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-base font-bold text-foreground">{c.visitCount}</td>
                        <td className="py-4 px-6 text-base font-extrabold text-foreground">{formatCurrency(c.totalSpent, currency)}</td>
                        <td className="py-4 px-6 text-center">
                          <Badge className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 font-bold tracking-wider">
                            {c.loyaltyPoints} pts
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="font-medium" onClick={() => setViewCustomer(c)}><Eye className="mr-2 w-4 h-4" />{t.dashboard.customers.viewProfile}</DropdownMenuItem>
                              <DropdownMenuItem className="font-medium" onClick={() => { setEditCustomer(c); setEditForm({ name: c.name, email: c.email || '', phoneNumber: c.phoneNumber || '' }); }}><Edit className="mr-2 w-4 h-4" />{t.dashboard.customers.edit}</DropdownMenuItem>
                              <DropdownMenuItem className="font-medium text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10"><Trash2 className="mr-2 w-4 h-4" />{t.dashboard.customers.delete}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-16 text-muted-foreground font-medium">{t.dashboard.customers.noCustomers}</div>
              )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.dashboard.customers.addCustomer}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.name}</Label>
              <Input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder={t.dashboard.customers.namePlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.email}</Label>
              <Input value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder={t.dashboard.customers.emailPlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.phone}</Label>
              <Input value={addForm.phoneNumber} onChange={e => setAddForm(p => ({ ...p, phoneNumber: e.target.value }))} placeholder={t.dashboard.customers.phonePlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-0 pt-4 border-t border-border/50">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setAddOpen(false)} disabled={adding}>{t.dashboard.customers.cancel}</Button>
            <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" onClick={async () => {
              if (!addForm.name) { toast.error(t.dashboard.customers.nameRequired); return; }
              setAdding(true);
              try {
                await customersService.createCustomer(addForm);
                toast.success(t.dashboard.customers.customerCreated);
                setAddOpen(false);
                setAddForm({ name: '', email: '', phoneNumber: '' });
                fetchCustomers();
              } catch { toast.error(t.dashboard.customers.failedToCreate); }
              finally { setAdding(false); }
            }} disabled={adding}>
              {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t.dashboard.customers.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewCustomer} onOpenChange={o => !o && setViewCustomer(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.dashboard.customers.profileTitle}</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-sm shrink-0">{viewCustomer.name.charAt(0)}</div>
                <div>
                  <p className="text-lg font-bold text-foreground">{viewCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{viewCustomer.email || t.dashboard.customers.noContact}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t.dashboard.customers.phone}</p>
                  <p className="text-sm font-bold text-foreground">{viewCustomer.phoneNumber || '-'}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t.dashboard.customers.joinDate}</p>
                  <p className="text-sm font-bold text-foreground">{viewCustomer.joinDate}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t.dashboard.customers.visitCount}</p>
                  <p className="text-sm font-bold text-foreground">{viewCustomer.visitCount}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t.dashboard.customers.totalSpent}</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(viewCustomer.totalSpent, currency)}</p>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">{t.dashboard.customers.loyaltyPoints}</p>
                  <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">{viewCustomer.loyaltyPoints}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-200 dark:bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-700 dark:text-amber-400 text-xl font-extrabold">pts</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t border-border/50 pt-4">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setViewCustomer(null)}>{t.dashboard.customers.cancel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editCustomer} onOpenChange={o => !o && setEditCustomer(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t.dashboard.customers.editCustomer}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.name}</Label>
              <Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder={t.dashboard.customers.namePlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.email}</Label>
              <Input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder={t.dashboard.customers.emailPlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.dashboard.customers.phone}</Label>
              <Input value={editForm.phoneNumber} onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))} placeholder={t.dashboard.customers.phonePlaceholder} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl" />
            </div>
          </div>
          <DialogFooter className="gap-3 sm:gap-0 pt-4 border-t border-border/50">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setEditCustomer(null)} disabled={editing}>{t.dashboard.customers.cancel}</Button>
            <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" onClick={async () => {
              if (!editForm.name) { toast.error(t.dashboard.customers.nameRequired); return; }
              if (!editCustomer) return;
              setEditing(true);
              try {
                await customersService.updateCustomer(editCustomer.id, editForm);
                toast.success(t.dashboard.customers.customerUpdated);
                setEditCustomer(null);
                fetchCustomers();
              } catch { toast.error(t.dashboard.customers.failedToUpdate); }
              finally { setEditing(false); }
            }} disabled={editing}>
              {editing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{t.dashboard.customers.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <p className="text-xs text-gray-400 dark:text-gray-500">{t.dashboard.customers.showing.replace('{count}', String(filtered.length)).replace('{total}', String(filtered.length))}</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="w-7 h-7" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="icon" className="w-7 h-7 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">1</Button>
                  <Button variant="outline" size="icon" className="w-7 h-7" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
