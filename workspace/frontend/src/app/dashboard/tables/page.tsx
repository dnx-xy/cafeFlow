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
  Dialog, DialogContent,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import {
  Search, Plus, Edit, Trash2, Eye, QrCode, Download, AlertTriangle, Table, MoreHorizontal,
} from 'lucide-react';
import { useI18n } from '@/i18n/context';
import { toast } from 'sonner';
import { useTables } from '@/hooks/useTables';

export default function TablesPage() {
  const { t } = useI18n();
  const { tables, loading, error, fetchTables, createTable, updateTable, deleteTable, generateQrCode } = useTables();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', name: '', capacity: 1, isActive: true });
  const [viewingQr, setViewingQr] = useState<{ tableNumber: string; code: string } | null>(null);

  useEffect(() => { fetchTables(); }, []);

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

  const handleGenerate = async (id: string, number: string) => {
    try {
      const qr = await generateQrCode(id);
      setViewingQr({ tableNumber: number, code: qr.code });
      toast.success(t.dashboard.tables.qrGenerated);
    } catch { toast.error('Failed to generate QR'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.tables.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.tables.subtitle}</p>
        </div>
        <Button size="sm" onClick={() => setIsCreating(true)}><Plus className="w-4 h-4 mr-1.5" /> {t.dashboard.tables.addTable}</Button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t.dashboard.tables.createNewTable}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.tables.tableNumber} *</label>
              <Input value={newTable.tableNumber} onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} placeholder="e.g. A01" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.tables.tableName}</label>
              <Input value={newTable.name} onChange={e => setNewTable({ ...newTable, name: e.target.value })} placeholder="e.g. Window Table 1" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.tables.capacity}</label>
              <Input type="number" min="1" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })} className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t.dashboard.tables.status}</label>
              <Select value={newTable.isActive ? 'true' : 'false'} onValueChange={v => setNewTable({ ...newTable, isActive: v === 'true' })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t.dashboard.tables.active}</SelectItem>
                  <SelectItem value="false">{t.dashboard.tables.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>{t.dashboard.tables.cancel}</Button>
            <Button size="sm" onClick={handleCreate}>{t.dashboard.tables.createTable}</Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.tables.allTables}</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder={t.dashboard.tables.searchTables} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm w-56" />
          </div>
        </div>
        <div className="p-5 pt-3">
          {loading ? (
            <div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-10"><AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-3" /><p className="text-red-500 text-sm mb-3">{error}</p><Button variant="outline" size="sm" onClick={() => fetchTables()}>Retry</Button></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800/50">
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">{t.dashboard.tables.table}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">{t.dashboard.tables.name}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">{t.dashboard.tables.capacity}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">{t.dashboard.tables.status}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">{t.dashboard.tables.qrCode}</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(table => (
                      <tr key={table.id} className="border-b border-gray-50 dark:border-gray-800/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white"><Table className="w-4.5 h-4.5" /></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">#{table.tableNumber}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm text-gray-500 dark:text-gray-400">{table.name || '-'}</td>
                        <td className="py-3.5"><Badge variant="outline" className="text-[10px]">{table.capacity} {table.capacity === 1 ? t.dashboard.tables.person : t.dashboard.tables.people}</Badge></td>
                        <td className="py-3.5">
                          <Badge variant="outline" className={`text-[10px] ${table.isActive ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                            {table.isActive ? t.dashboard.tables.active : t.dashboard.tables.inactive}
                          </Badge>
                        </td>
                        <td className="py-3.5">
                          {table.qrCodes && table.qrCodes.length > 0 ? (
                            <button onClick={() => { const last = table.qrCodes![table.qrCodes!.length - 1]; setViewingQr({ tableNumber: table.tableNumber, code: last.code }); }}>
                              <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"><QrCode className="w-3 h-3 mr-1" />{t.dashboard.tables.generated}</Badge>
                            </button>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">{t.dashboard.tables.noQr}</Badge>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => toast.info(`Table #${table.tableNumber}`)}><Eye className="mr-2 w-4 h-4" />{t.dashboard.tables.viewDetails}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Edit coming soon')}><Edit className="mr-2 w-4 h-4" />{t.dashboard.tables.editTable}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleGenerate(table.id, table.tableNumber)}><QrCode className="mr-2 w-4 h-4" />{t.dashboard.tables.generateQr}</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => deleteTable(table.id)}><Trash2 className="mr-2 w-4 h-4" />{t.dashboard.tables.delete}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Table className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.dashboard.tables.noTables}</p>
                  {!isCreating && <Button size="sm" onClick={() => setIsCreating(true)}><Plus className="w-4 h-4 mr-1.5" />{t.dashboard.tables.createFirstTable}</Button>}
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
            <div className="bg-white p-4 rounded-xl">
              {viewingQr && <QRCodeSVG value={`${process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/scan/${viewingQr.code}`} size={200} level="M" />}
            </div>
            <p className="text-xs text-gray-400 text-center">{t.dashboard.tables.scanToOpen.replace('{number}', viewingQr?.tableNumber || '')}</p>
            <Button variant="outline" size="sm" onClick={() => {
              const svg = document.querySelector('.qr-code-dialog svg');
              if (svg) {
                const c = document.createElement('canvas');
                const ctx = c.getContext('2d');
                const img = new Image();
                img.onload = () => { c.width = img.width; c.height = img.height; ctx?.drawImage(img, 0, 0); const a = document.createElement('a'); a.download = `table-${viewingQr?.tableNumber}-qr.png`; a.href = c.toDataURL(); a.click(); };
                img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
              }
            }}>
              <Download className="w-4 h-4 mr-2" />{t.dashboard.tables.downloadQr}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
