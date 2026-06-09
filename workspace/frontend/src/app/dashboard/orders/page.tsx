'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Timer, User, CreditCard, ChevronRight as ArrowRight,
} from 'lucide-react';
import { useOrders, useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/i18n/context';
import { formatCurrency, getCurrencyInfo } from '@/lib/currency';
import { toast } from 'sonner';
import { exportOrder, exportOrdersCollection, BusinessHeaderInfo } from '@/lib/orderExportUtils';

export default function OrdersPage() {
  const router = useRouter();
  const { currency } = useCurrency();
  const { t } = useI18n();
  const { orders, loading, error, pagination, fetchOrders, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const { business, fetchBusiness } = useBusiness();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => {
    if (user?.businessId) fetchBusiness(user.businessId);
  }, [user?.businessId]);

  const exportHeader: BusinessHeaderInfo | undefined = business ? {
    name: business.name,
    description: business.description,
    logoUrl: business.logoUrl,
    address: business.address,
    city: business.city,
    phone: business.whatsappNumber,
    currencySymbol: getCurrencyInfo(currency).symbol,
  } : undefined;

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (o.orderId.toLowerCase().includes(q) || o.customer?.toLowerCase().includes(q) || o.tableNumber?.toLowerCase().includes(q))
      && (statusFilter === 'all' || o.status === statusFilter);
  });

  const ordersByStatus = {
    PENDING: filtered.filter(o => o.status === 'PENDING'),
    CONFIRMED: filtered.filter(o => o.status === 'CONFIRMED'),
    PREPARING: filtered.filter(o => o.status === 'PREPARING'),
    READY: filtered.filter(o => o.status === 'READY'),
    COMPLETED: filtered.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED'),
  };

  const handleStatus = async (id: string, status: string) => {
    try { await updateOrderStatus(id, status); toast.success(t.dashboard.orders.statusUpdated); }
    catch { toast.error(t.dashboard.orders.statusFailed); }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const renderOrderCard = (order: typeof filtered[number], columnStatus: string) => {
    const nextStatus = {
      PENDING: 'CONFIRMED',
      CONFIRMED: 'PREPARING',
      PREPARING: 'READY',
      READY: 'DELIVERED',
      COMPLETED: null,
    }[columnStatus];

    const nextLabel = {
      PENDING: 'Confirm',
      CONFIRMED: 'Start Prep',
      PREPARING: 'Mark Ready',
      READY: 'Complete',
      COMPLETED: null,
    }[columnStatus];

    return (
      <div key={order.id} className="bg-card border border-border/50 rounded-xl p-3 hover:shadow-md transition-all group cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-foreground truncate">{order.orderId}</p>
            <div className="flex items-center gap-1 mt-1">
              {order.tableNumber ? (
                <>
                  <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Table {order.tableNumber}</span>
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground italic">No table</span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold text-foreground">{formatCurrency(order.totalAmount, currency)}</p>
          </div>
        </div>

        {order.customer && (
          <div className="flex items-center gap-1 mb-2">
            <User className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] text-muted-foreground truncate">{order.customer}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-3">
          {order.paymentStatus === 'PAID' ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : order.paymentStatus === 'PENDING' ? (
            <Clock className="w-3 h-3 text-amber-500" />
          ) : (
            <X className="w-3 h-3 text-rose-500" />
          )}
          <span className={`text-[9px] font-bold uppercase tracking-wider ${order.paymentStatus === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' : order.paymentStatus === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {order.paymentStatus}
          </span>
          <span className="text-muted-foreground/30 mx-0.5">•</span>
          <Timer className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] font-medium text-muted-foreground">{timeAgo(order.createdAt)}</span>
        </div>

        {order.orderItems && order.orderItems.length > 0 && (
          <div className="border-t border-border/30 pt-2 mb-2">
            <p className="text-[9px] text-muted-foreground truncate">
              {order.orderItems.slice(0, 2).map(i => i.menuItem?.name).filter(Boolean).join(', ')}
              {order.orderItems.length > 2 && ` +${order.orderItems.length - 2}`}
            </p>
          </div>
        )}

        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {nextStatus && (
            <Button 
              size="sm" 
              className="h-7 text-[10px] font-bold flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => handleStatus(order.id, nextStatus)}
            >
              {nextLabel} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${order.id}`)} className="text-xs">
                <Eye className="mr-2 w-3.5 h-3.5" />View Details
              </DropdownMenuItem>
              {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && order.status !== 'DELIVERED' && (
                <DropdownMenuItem className="text-xs text-rose-600" onClick={() => handleStatus(order.id, 'CANCELLED')}>
                  <X className="mr-2 w-3.5 h-3.5" />Cancel Order
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => window.print()} className="text-xs">
                <Printer className="mr-2 w-3.5 h-3.5" />Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.orders.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.orders.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.dashboard.orders.totalOrders, value: orders.length, icon: ShoppingCart, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
          { label: t.dashboard.orders.todaysRevenue, value: '$0', icon: ShoppingCart, bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
          { label: t.dashboard.orders.pendingOrders, value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
          { label: t.dashboard.orders.avgOrderValue, value: '$0', icon: ShoppingCart, bg: 'bg-indigo-100 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400' },
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

      <div className="bg-card rounded-3xl border border-border/50 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder={t.dashboard.orders.search} value={search} onChange={e => setSearch(e.target.value)} className="pl-12 h-12 bg-muted/50 border-0 focus-visible:ring-amber-500 rounded-xl font-medium" />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/30 border-0 focus:ring-amber-500 rounded-xl font-semibold">
              <SelectValue placeholder={t.dashboard.orders.allStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium">{t.dashboard.orders.allStatus}</SelectItem>
              {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(s => (
                <SelectItem key={s} value={s} className="font-medium">{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-xl font-semibold">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={async () => {
                await exportOrdersCollection({ orders: filtered as any, title: 'All Orders' }, 'xlsx', exportHeader);
              }}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await exportOrdersCollection({ orders: filtered as any, title: 'All Orders' }, 'pdf', exportHeader);
              }}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border/50">
          <p className="text-rose-500 text-sm font-medium mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchOrders()}>Retry</Button>
        </div>
      ) : (
        <>
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* PENDING Column */}
            <div className="bg-muted/10 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Pending</h3>
                </div>
                <span className="text-xs font-extrabold bg-amber-500 text-white px-2.5 py-1 rounded-full">
                  {ordersByStatus.PENDING.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {ordersByStatus.PENDING.map(order => renderOrderCard(order, 'PENDING'))}
                {ordersByStatus.PENDING.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No pending orders</p>
                )}
              </div>
            </div>

            {/* CONFIRMED Column */}
            <div className="bg-muted/10 rounded-2xl p-4 border-2 border-blue-200 dark:border-blue-900/50">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Confirmed</h3>
                </div>
                <span className="text-xs font-extrabold bg-blue-500 text-white px-2.5 py-1 rounded-full">
                  {ordersByStatus.CONFIRMED.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {ordersByStatus.CONFIRMED.map(order => renderOrderCard(order, 'CONFIRMED'))}
                {ordersByStatus.CONFIRMED.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No confirmed orders</p>
                )}
              </div>
            </div>

            {/* PREPARING Column */}
            <div className="bg-muted/10 rounded-2xl p-4 border-2 border-indigo-200 dark:border-indigo-900/50">
              <div className="flex items-center justify-between mb-4 pb-3 border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Preparing</h3>
                </div>
                <span className="text-xs font-extrabold bg-indigo-500 text-white px-2.5 py-1 rounded-full">
                  {ordersByStatus.PREPARING.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {ordersByStatus.PREPARING.map(order => renderOrderCard(order, 'PREPARING'))}
                {ordersByStatus.PREPARING.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No orders in prep</p>
                )}
              </div>
            </div>

            {/* READY Column */}
            <div className="bg-muted/10 rounded-2xl p-4 border-2 border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Ready</h3>
                </div>
                <span className="text-xs font-extrabold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                  {ordersByStatus.READY.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {ordersByStatus.READY.map(order => renderOrderCard(order, 'READY'))}
                {ordersByStatus.READY.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No orders ready</p>
                )}
              </div>
            </div>

            {/* COMPLETED Column */}
            <div className="bg-muted/10 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-900/50">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Completed</h3>
                </div>
                <span className="text-xs font-extrabold bg-gray-400 text-white px-2.5 py-1 rounded-full">
                  {ordersByStatus.COMPLETED.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                {ordersByStatus.COMPLETED.map(order => renderOrderCard(order, 'COMPLETED'))}
                {ordersByStatus.COMPLETED.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12 italic">No completed orders</p>
                )}
              </div>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-bold text-muted-foreground">{t.dashboard.orders.noOrders}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
