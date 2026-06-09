'use client';

import { useState, useEffect, useRef } from 'react';
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
  Dialog, DialogContent,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import {
  Search, Plus, Edit, Trash2, Eye, QrCode, Download, AlertTriangle, Table, MoreHorizontal, Save,
} from 'lucide-react';
import { useI18n } from '@/i18n/context';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { useTables } from '@/hooks/useTables';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';

export default function TablesPage() {
  const { t } = useI18n();
  const { tables, loading, error, fetchTables, createTable, updateTable, deleteTable, generateQrCode } = useTables();
  const { user } = useAuth();
  const { business, fetchBusiness } = useBusiness();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', name: '', capacity: 1, isActive: true });
  const [viewingQr, setViewingQr] = useState<{ tableNumber: string; code: string } | null>(null);
  const [viewingTable, setViewingTable] = useState<any | null>(null);
  const [editingTable, setEditingTable] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ tableNumber: '', name: '', capacity: 1, isActive: true });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchTables(); }, []);
  useEffect(() => {
    if (user?.businessId) fetchBusiness(user.businessId);
  }, [user?.businessId]);

  const filtered = (tables || []).filter(t =>
    t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createTable({
        ...newTable,
        tableNumber: newTable.tableNumber || `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      });
      setIsCreating(false);
      setNewTable({ tableNumber: '', name: '', capacity: 1, isActive: true });
      toast.success(t.dashboard.tables.tableCreated);
    } catch { toast.error('Failed to create table'); }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || !viewingQr) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const a = document.createElement('a');
      a.download = `table-${viewingQr.tableNumber}-tent-card.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      toast.success('Table tent card downloaded');
    } catch { toast.error('Failed to generate card'); }
  };

  const handleGenerate = async (id: string, number: string) => {
    try {
      const qr = await generateQrCode(id);
      setViewingQr({ tableNumber: number, code: qr.code });
      toast.success(t.dashboard.tables.qrGenerated);
    } catch { toast.error('Failed to generate QR'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t.dashboard.tables.title}</h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.tables.subtitle}</p>
        </div>
        <Button className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl hover:scale-105 transition-all" onClick={() => setIsCreating(true)}>
          <Plus className="w-5 h-5 mr-2" /> {t.dashboard.tables.addTable}
        </Button>
      </div>

      {isCreating && (
        <div className="bg-card rounded-3xl border border-amber-500/30 shadow-lg shadow-amber-500/5 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-foreground mb-6">{t.dashboard.tables.createNewTable}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.tableNumber} *</label>
              <Input value={newTable.tableNumber} onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} placeholder="e.g. A01" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.tableName}</label>
              <Input value={newTable.name} onChange={e => setNewTable({ ...newTable, name: e.target.value })} placeholder="e.g. Window Table 1" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.capacity}</label>
              <Input type="number" min="1" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.status}</label>
              <Select value={newTable.isActive ? 'true' : 'false'} onValueChange={v => setNewTable({ ...newTable, isActive: v === 'true' })}>
                <SelectTrigger className="h-11 bg-muted/50 border-0 focus:ring-amber-500 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true" className="font-medium">{t.dashboard.tables.active}</SelectItem>
                  <SelectItem value="false" className="font-medium">{t.dashboard.tables.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setIsCreating(false)}>{t.dashboard.tables.cancel}</Button>
            <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" onClick={handleCreate}>{t.dashboard.tables.createTable}</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border/50 gap-4">
          <CardTitle className="text-xl font-bold text-foreground">{t.dashboard.tables.allTables}</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={t.dashboard.tables.searchTables} value={search} onChange={e => setSearch(e.target.value)} className="pl-11 h-11 bg-muted/30 border-0 focus-visible:ring-amber-500 rounded-xl font-medium w-full" />
          </div>
        </div>
        <div className="p-0 flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-16"><AlertTriangle className="w-12 h-12 mx-auto text-rose-500 mb-4 opacity-50" /><p className="text-rose-500 text-sm font-bold mb-4">{error}</p><Button variant="outline" onClick={() => fetchTables()} className="h-11 px-6 rounded-xl">Retry</Button></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border/50">
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">{t.dashboard.tables.table}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">{t.dashboard.tables.name}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">{t.dashboard.tables.capacity}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">{t.dashboard.tables.status}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">{t.dashboard.tables.qrCode}</th>
                      <th className="text-right font-semibold text-muted-foreground py-4 px-6 uppercase tracking-wider text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map(table => (
                      <tr key={table.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform shrink-0"><Table className="w-5 h-5" /></div>
                            <span className="text-base font-extrabold text-foreground group-hover:text-amber-600 transition-colors">#{table.tableNumber}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">{table.name || '-'}</td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="font-bold text-xs bg-muted text-muted-foreground border-0">
                            {table.capacity} {table.capacity === 1 ? t.dashboard.tables.person : t.dashboard.tables.people}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border-0 shadow-sm ${table.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                            {table.isActive ? t.dashboard.tables.active : t.dashboard.tables.inactive}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          {table.qrCodes && table.qrCodes.length > 0 ? (
                            <button onClick={() => { const last = table.qrCodes![table.qrCodes!.length - 1]; setViewingQr({ tableNumber: table.tableNumber, code: last.code }); }} className="hover:scale-105 transition-transform active:scale-95 block">
                              <Badge variant="outline" className="text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 shadow-sm py-1">
                                <QrCode className="w-3.5 h-3.5 mr-1.5" />{t.dashboard.tables.generated}
                              </Badge>
                            </button>
                          ) : (
                            <Badge variant="destructive" className="text-xs font-bold border-0 shadow-sm opacity-80">{t.dashboard.tables.noQr}</Badge>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="font-medium" onClick={() => setViewingTable(table)}><Eye className="mr-2 w-4 h-4" />{t.dashboard.tables.viewDetails}</DropdownMenuItem>
                              <DropdownMenuItem className="font-medium" onClick={() => { setEditingTable(table); setEditForm({ tableNumber: table.tableNumber, name: table.name || '', capacity: table.capacity, isActive: table.isActive }); }}><Edit className="mr-2 w-4 h-4" />{t.dashboard.tables.editTable}</DropdownMenuItem>
                              <DropdownMenuItem className="font-medium text-amber-600" onClick={() => handleGenerate(table.id, table.tableNumber)}><QrCode className="mr-2 w-4 h-4" />{t.dashboard.tables.generateQr}</DropdownMenuItem>
                              <DropdownMenuItem className="font-medium text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10" onClick={() => deleteTable(table.id)}><Trash2 className="mr-2 w-4 h-4" />{t.dashboard.tables.delete}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Table className="w-8 h-8 text-muted-foreground opacity-50" /></div>
                  <p className="text-lg font-bold text-foreground mb-2">{t.dashboard.tables.noTables}</p>
                  <p className="text-sm font-medium text-muted-foreground mb-6">Get started by creating your first table layout.</p>
                  {!isCreating && <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20" onClick={() => setIsCreating(true)}><Plus className="w-5 h-5 mr-2" />{t.dashboard.tables.createFirstTable}</Button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={viewingQr !== null} onOpenChange={open => { if (!open) setViewingQr(null); }}>
        <DialogContent className="sm:max-w-sm qr-code-dialog">
          <div className="flex flex-col items-center gap-4 py-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Table #{viewingQr?.tableNumber}</h3>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              {viewingQr && <QRCodeSVG value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingQr.code}`} size={200} level="M" />}
            </div>
            <p className="text-xs text-gray-400 text-center font-medium mt-2">{t.dashboard.tables.scanToOpen.replace('{number}', viewingQr?.tableNumber || '')}</p>
            <Button className="h-11 px-6 font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 w-full mt-2" onClick={handleDownloadCard}>
              <Download className="w-4 h-4 mr-2" />{t.dashboard.tables.downloadQr}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {viewingQr && business && (
        <div ref={cardRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 600, height: 900, background: '#fff', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px 32px', display: 'flex', flexDirection: 'column', borderRadius: 16, borderWidth: 1, borderStyle: 'solid', borderColor: '#eee' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 2 }}>
              {business.logoUrl ? (
                <img src={business.logoUrl} alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {business.name.charAt(0)}
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: '28px' }}>{business.name}</div>
            </div>
            {business.description && <div style={{ fontSize: 10, color: '#999', fontWeight: 400, marginTop: 2 }}>{business.description}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 140 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 4 }}>Table</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-2px', marginBottom: 32, lineHeight: 0.9 }}>#{viewingQr.tableNumber}</div>
            <div style={{ width: 360, height: 360, background: '#fff', borderRadius: 20, border: '3px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <QRCodeSVG value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingQr.code}`} size={320} level="M" />
            </div>
            <div style={{ fontSize: 11, color: '#999', textAlign: 'center', fontWeight: 600, letterSpacing: 0.5 }}>Scan to view menu &amp; place your order</div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 12, textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ fontSize: 9, color: '#aaa', lineHeight: 1.5 }}>
              {business.whatsappNumber && <span>{business.whatsappNumber}</span>}
              {business.whatsappNumber && user?.email && <span style={{ margin: '0 6px', color: '#ddd' }}>|</span>}
              {user?.email && <span>{user.email}</span>}
            </div>
            {business.address && <div style={{ fontSize: 8, color: '#ccc', marginTop: 2 }}>{[business.address, business.city].filter(Boolean).join(', ')}</div>}
            <div style={{ fontSize: 7, color: '#ddd', marginTop: 6, letterSpacing: 1 }}>{business.name.toUpperCase()} &middot; PLEASE SCAN TO ORDER</div>
          </div>
        </div>
      )}

      {/* View Table Details Dialog */}
      <Dialog open={viewingTable !== null} onOpenChange={open => { if (!open) setViewingTable(null); }}>
        <DialogContent className="sm:max-w-md">
          {viewingTable && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Table className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t.dashboard.tables.tableInfo}</h3>
                  <p className="text-sm font-medium text-muted-foreground">#{viewingTable.tableNumber}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.tableNumber}</p>
                    <p className="text-base font-bold text-foreground">#{viewingTable.tableNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.name}</p>
                    <p className="text-base font-medium text-foreground">{viewingTable.name || <span className="text-muted-foreground italic">{t.dashboard.tables.noName}</span>}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.capacity}</p>
                    <p className="text-base font-bold text-foreground">{viewingTable.capacity} {viewingTable.capacity === 1 ? t.dashboard.tables.person : t.dashboard.tables.people}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.status}</p>
                    <Badge className={`mt-0.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider border-0 ${viewingTable.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                      {viewingTable.isActive ? t.dashboard.tables.active : t.dashboard.tables.inactive}
                    </Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.dashboard.tables.qrCode}</p>
                  {viewingTable.qrCodes && viewingTable.qrCodes.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1 rounded-lg border border-border/50 shrink-0">
                        <QRCodeSVG value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingTable.qrCodes[viewingTable.qrCodes.length - 1].code}`} size={48} level="M" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className="text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 w-fit">
                          <QrCode className="w-3 h-3 mr-1" />{t.dashboard.tables.generated}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 -ml-2" onClick={() => {
                          const last = viewingTable.qrCodes![viewingTable.qrCodes!.length - 1];
                          setViewingQr({ tableNumber: viewingTable.tableNumber, code: last.code });
                        }}>{t.dashboard.tables.viewQr}</Button>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="destructive" className="text-xs font-bold border-0">{t.dashboard.tables.noQr}</Badge>
                  )}
                </div>

                <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.createdAt}</p>
                    <p className="text-sm font-medium text-foreground">{new Date(viewingTable.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t.dashboard.tables.updatedAt}</p>
                    <p className="text-sm font-medium text-foreground">{new Date(viewingTable.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Table Dialog */}
      <Dialog open={editingTable !== null} onOpenChange={open => { if (!open) { setEditingTable(null); } }}>
        <DialogContent className="sm:max-w-md">
          {editingTable && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{t.dashboard.tables.editTableDetails}</h3>
                  <p className="text-sm font-medium text-muted-foreground">#{editingTable.tableNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.tableNumber} *</label>
                  <Input value={editForm.tableNumber} onChange={e => setEditForm({ ...editForm, tableNumber: e.target.value })} placeholder="e.g. A01" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.tableName}</label>
                  <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="e.g. Window Table 1" className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.capacity}</label>
                  <Input type="number" min="1" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: parseInt(e.target.value) || 1 })} className="h-11 bg-muted/50 border-0 focus-visible:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t.dashboard.tables.status}</label>
                  <Select value={editForm.isActive ? 'true' : 'false'} onValueChange={v => setEditForm({ ...editForm, isActive: v === 'true' })}>
                    <SelectTrigger className="h-11 bg-muted/50 border-0 focus:ring-amber-500 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true" className="font-medium">{t.dashboard.tables.active}</SelectItem>
                      <SelectItem value="false" className="font-medium">{t.dashboard.tables.inactive}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" className="h-11 px-6 rounded-xl font-semibold border-border/50" onClick={() => setEditingTable(null)}>{t.dashboard.tables.cancel}</Button>
                <Button className="h-11 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" onClick={async () => {
                  try {
                    await updateTable(editingTable.id, editForm);
                    setEditingTable(null);
                    toast.success(t.dashboard.tables.tableCreated);
                  } catch { toast.error('Failed to update table'); }
                }}>
                  <Save className="w-4 h-4 mr-2" />{t.dashboard.tables.saveChanges}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
