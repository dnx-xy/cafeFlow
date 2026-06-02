'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
  Search, Plus, Edit, Trash2, Eye, QrCode, Download, AlertTriangle, Table, MoreHorizontal, Printer,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTables } from '@/hooks/useTables';

export default function QrCodesPage() {
  const { tables, loading, error, fetchTables, createTable, deleteTable, generateQrCode } = useTables();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: '', name: '', capacity: 1, isActive: true });
  const [viewingQr, setViewingQr] = useState<{ id: string; tableNumber: string; code: string } | null>(null);

  useEffect(() => { fetchTables(); }, []);

  const filtered = (tables || []).filter(t =>
    t.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createTable(newTable);
      setIsCreating(false);
      setNewTable({ tableNumber: '', name: '', capacity: 1, isActive: true });
      toast.success('Table created');
    } catch { toast.error('Failed to create table'); }
  };

  const handleGenerate = async (id: string, number: string) => {
    try {
      const qr = await generateQrCode(id);
      setViewingQr({ id, tableNumber: number, code: qr.code });
      toast.success('QR code generated');
    } catch { toast.error('Failed to generate QR'); }
  };

  const getQrBaseUrl = () => process.env.NEXT_PUBLIC_QR_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

  const handlePrintAll = () => {
    const origin = getQrBaseUrl();
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Popup blocked. Please allow popups.'); return; }
    const tableCards = filtered.filter(t => t.qrCodes?.length).map(t => {
      const last = t.qrCodes![t.qrCodes!.length - 1];
      const qrUrl = `${origin}/scan/${last.code}`;
      return `<div class="card"><h3>Table #${t.tableNumber}</h3><p>${t.name || ''}</p><p>${qrUrl}</p></div>`;
    }).join('');
    printWindow.document.write(`
      <html><head><title>Cafe R - QR Codes</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
        .card { text-align: center; border: 1px dashed #ccc; border-radius: 8px; padding: 16px; width: 200px; break-inside: avoid; }
        .card h3 { margin: 8px 0 4px; font-size: 14px; }
        .card p { margin: 2px 0; font-size: 11px; color: #666; word-break: break-all; }
        .qrcode { width: 160px; height: 160px; margin: 0 auto; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; border-radius: 8px; }
        @media print { .no-print { display: none; } }
      </style></head><body>
      <h2 class="no-print" style="text-align:center;">Cafe R - QR Codes</h2>
      <button class="no-print" onclick="window.print()" style="display:block;margin:0 auto 20px;padding:8px 20px;cursor:pointer;">Print</button>
      <div class="grid">${tableCards}</div>
      <p class="no-print" style="text-align:center;margin-top:20px;font-size:12px;color:#999;">Tip: Print this page, then scan each URL from your phone to generate the QR code</p>
      </body></html>
    `);
    printWindow.document.close();
  };

  const downloadQrPng = (filename: string) => {
    const svg = document.querySelector('.qr-code-dialog svg') as SVGSVGElement;
    if (!svg) return;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => { c.width = img.width * 2; c.height = img.height * 2; ctx!.scale(2, 2); ctx?.drawImage(img, 0, 0); const a = document.createElement('a'); a.download = filename; a.href = c.toDataURL('image/png'); a.click(); };
    img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">QR Codes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage tables and generate QR codes for customer scanning</p>
        </div>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <Button variant="outline" size="sm" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-1.5" /> Print All
            </Button>
          )}
          <Button size="sm" onClick={() => setIsCreating(true)}><Plus className="w-4 h-4 mr-1.5" /> Add Table</Button>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Create New Table</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Table Number *</label>
              <Input value={newTable.tableNumber} onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} placeholder="e.g. A01" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Table Name</label>
              <Input value={newTable.name} onChange={e => setNewTable({ ...newTable, name: e.target.value })} placeholder="e.g. Window Table 1" className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Capacity</label>
              <Input type="number" min="1" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: parseInt(e.target.value) || 1 })} className="h-9 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
              <Select value={newTable.isActive ? 'true' : 'false'} onValueChange={v => setNewTable({ ...newTable, isActive: v === 'true' })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate}>Create Table</Button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Tables & QR Codes</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search tables..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm w-56" />
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
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Table</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Name</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Capacity</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Status</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">QR Code</th>
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
                        <td className="py-3.5"><Badge variant="outline" className="text-[10px]">{table.capacity} {table.capacity === 1 ? 'person' : 'people'}</Badge></td>
                        <td className="py-3.5">
                          <Badge variant="outline" className={`text-[10px] ${table.isActive ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                            {table.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3.5">
                          {table.qrCodes && table.qrCodes.length > 0 ? (
                            <button onClick={() => { const last = table.qrCodes![table.qrCodes!.length - 1]; setViewingQr({ id: table.id, tableNumber: table.tableNumber, code: last.code }); }}>
                              <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"><QrCode className="w-3 h-3 mr-1" />Generated</Badge>
                            </button>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">No QR</Badge>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => toast.info(`Table #${table.tableNumber} - ${table.name || 'No name'}`)}><Eye className="mr-2 w-4 h-4" />View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info('Edit coming soon')}><Edit className="mr-2 w-4 h-4" />Edit Table</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleGenerate(table.id, table.tableNumber)}><QrCode className="mr-2 w-4 h-4" />Generate QR</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => deleteTable(table.id)}><Trash2 className="mr-2 w-4 h-4" />Delete</DropdownMenuItem>
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No tables found</p>
                  {!isCreating && <Button size="sm" onClick={() => setIsCreating(true)}><Plus className="w-4 h-4 mr-1.5" />Create First Table</Button>}
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
              {viewingQr && (
                <QRCodeSVG
                  value={`${getQrBaseUrl()}/scan/${viewingQr.code}`}
                  size={200}
                  level="M"
                />
              )}
            </div>
            <p className="text-xs text-gray-400 text-center">Scan to open menu for Table #{viewingQr?.tableNumber}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => downloadQrPng(`table-${viewingQr?.tableNumber}-qr.png`)}>
                <Download className="w-4 h-4 mr-2" />Download PNG
              </Button>
              <Button variant="outline" size="sm" onClick={() => { window.open(`/scan/${viewingQr?.code}`, '_blank'); }}>
                <Eye className="w-4 h-4 mr-2" />Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
