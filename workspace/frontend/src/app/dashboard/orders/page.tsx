'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Search, MoreHorizontal, Eye, Check, X, Printer, Download,
  ChevronLeft, ChevronRight, ShoppingCart, Clock, MapPin,
} from 'lucide-react';
import { useOrders } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { currency } = useCurrency();
  const { orders, loading, error, pagination, fetchOrders, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (o.orderId.toLowerCase().includes(q) || o.customer?.toLowerCase().includes(q) || o.tableNumber?.toLowerCase().includes(q))
      && (statusFilter === 'all' || o.status === statusFilter);
  });

  const handleStatus = async (id: string, status: string) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); }
    catch { toast.error('Failed to update'); }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    PREPARING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    READY: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    DELIVERED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: '1,247', icon: ShoppingCart },
          { label: "Today's Revenue", value: '$2,847', icon: ShoppingCart },
          { label: 'Pending Orders', value: '12', icon: Clock },
          { label: 'Avg Order Value', value: '$19.72', icon: ShoppingCart },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
              </div>
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <s.icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(s => (
                  <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Orders</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs"><Printer className="w-3.5 h-3.5 mr-1.5" /> Print</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
          </div>
        </div>
        <div className="p-5 pt-3">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 text-sm mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={() => fetchOrders()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800/50">
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Order</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Table</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Customer</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Amount</th>
                      <th className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Status</th>
                      <th className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Payment</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => (
                      <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.orderId}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1 text-gray-400" />{order.tableNumber || 'N/A'}</span>
                        </td>
                        <td className="py-3.5">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{order.customer || 'N/A'}</p>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount, currency)}</span>
                        </td>
                        <td className="py-3.5 text-center">
                          <Badge variant="outline" className={`text-[10px] capitalize ${statusColors[order.status] || ''}`}>
                            {order.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[11px] font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600 dark:text-green-400' : order.paymentStatus === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem><Eye className="mr-2 w-4 h-4" />View Details</DropdownMenuItem>
                              {order.status === 'PENDING' && <DropdownMenuItem onClick={() => handleStatus(order.id, 'CONFIRMED')}><Check className="mr-2 w-4 h-4" />Confirm</DropdownMenuItem>}
                              {order.status === 'CONFIRMED' && <DropdownMenuItem onClick={() => handleStatus(order.id, 'PREPARING')}><Check className="mr-2 w-4 h-4" />Mark Preparing</DropdownMenuItem>}
                              {order.status === 'PREPARING' && <DropdownMenuItem onClick={() => handleStatus(order.id, 'READY')}><Check className="mr-2 w-4 h-4" />Mark Ready</DropdownMenuItem>}
                              {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                <DropdownMenuItem className="text-red-600" onClick={() => handleStatus(order.id, 'CANCELLED')}><X className="mr-2 w-4 h-4" />Cancel</DropdownMenuItem>
                              )}
                              <DropdownMenuItem><Printer className="mr-2 w-4 h-4" />Print Receipt</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No orders found</div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <p className="text-xs text-gray-400 dark:text-gray-500">Showing 1-{filtered.length} of {filtered.length}</p>
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
