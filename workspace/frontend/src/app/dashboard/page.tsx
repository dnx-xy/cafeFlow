'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Award, Clock, QrCode, BarChart3, ArrowRight, Activity, Percent,
  UtensilsCrossed, Megaphone
} from 'lucide-react';
import { useOrders, useCustomers, useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/i18n/context';
import { formatCurrency } from '@/lib/currency';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const { currency } = useCurrency();
  const { t } = useI18n();
  const { user } = useAuth();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const { customers, loading: customersLoading, fetchCustomers } = useCustomers();
  const { data: analytics, loading: analyticsLoading, fetchAnalytics } = useAnalytics();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    qrScans: 0,
    returning: 0,
    avgOrder: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchAnalytics('week');
  }, []);

  useEffect(() => {
    if (analytics) {
      setStats({
        revenue: analytics.revenue.total,
        orders: analytics.orders.total,
        customers: analytics.customers.total,
        qrScans: 0,
        returning: analytics.customerRetention?.rate || 0,
        avgOrder: analytics.avgOrderValue.value,
      });
    }
  }, [analytics]);

  const todaySummary = {
    openOrders: orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    newCustomers: customers.filter(c => {
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length,
  };

  const revenueData = analytics?.revenueChart?.length
    ? analytics.revenueChart.map((item, i) => ({
        name: weekDays[i] || item.date,
        revenue: item.revenue,
        orders: item.orders,
      }))
    : weekDays.map((name, i) => ({
        name,
        revenue: 0,
        orders: 0,
      }));

  const topProducts = analytics?.topItems || [];

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
    PREPARING: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30',
    READY: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30',
    COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* ───── HEADER ───── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-1">
            {t.dashboard.home.greeting.replace('{{name}}', user?.name || 'User')}
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            {t.dashboard.home.subtitle.replace('{{cafe}}', user?.name || 'Your Cafe')}
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-xs font-semibold bg-emerald-50/50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 w-fit">
          <span className="relative flex w-2 h-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
          </span>
          {t.dashboard.home.live}
        </Badge>
      </div>

      {/* ───── KPI BENTO GRID ───── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {([
          { title: t.dashboard.home.revenue, value: formatCurrency(stats.revenue, currency), change: '+12%', icon: DollarSign, trend: 'up' as const, highlight: true },
          { title: t.dashboard.home.orders, value: stats.orders.toLocaleString(), change: '+8%', icon: ShoppingCart, trend: 'up' as const, highlight: false },
          { title: t.dashboard.home.customers, value: stats.customers.toLocaleString(), change: '+5%', icon: Users, trend: 'up' as const, highlight: false },
          { title: t.dashboard.home.qrScans, value: stats.qrScans.toLocaleString(), change: '+24%', icon: QrCode, trend: 'up' as const, highlight: false },
          { title: t.dashboard.home.returning, value: `${stats.returning}%`, change: '+5%', icon: Award, trend: 'up' as const, highlight: false },
          { title: t.dashboard.home.avgOrder, value: formatCurrency(stats.avgOrder, currency), change: '-2%', icon: Percent, trend: 'down' as const, highlight: false },
        ] as const).map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${kpi.highlight ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20' : 'bg-card'}`}>
            {kpi.highlight && (
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <kpi.icon className="w-16 h-16 transform rotate-12" />
               </div>
            )}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.highlight ? 'bg-white/20 backdrop-blur-sm' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.highlight ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
              </div>
              <Badge variant="secondary" className={`text-[11px] font-bold border-0 ${kpi.highlight ? 'bg-white/20 text-white hover:bg-white/30' : kpi.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {kpi.change}
              </Badge>
            </div>
            <div className="relative z-10">
              <div className={`text-2xl font-extrabold tracking-tight mb-1 ${kpi.highlight ? 'text-white' : 'text-foreground'}`}>{kpi.value}</div>
              <div className={`text-xs font-medium ${kpi.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>{kpi.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ───── CHART BENTO ───── */}
        <div className="xl:col-span-2 rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.home.revenueOverview}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.home.revenueSubtitle}</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-semibold">{t.dashboard.home.thisWeek}</Badge>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value: number) => [formatCurrency(value, currency), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ───── TOP PRODUCTS BENTO ───── */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.home.topProducts}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.home.topProductsSubtitle}</p>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">{product.name}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{product.sales} {t.dashboard.home.sold}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-foreground">{formatCurrency(product.revenue, currency)}</p>
                  <div className={`flex items-center justify-end text-xs font-semibold mt-0.5 ${product.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {product.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {product.trend === 'up' ? '+5%' : '-2%'}
                  </div>
                </div>
              </div>
            )) : (
               <div className="flex-1 flex items-center justify-center text-sm font-medium text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
                 No data yet
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ───── RECENT ORDERS TABLE BENTO ───── */}
        <div className="xl:col-span-2 rounded-3xl border border-border/50 bg-card shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.home.recentOrders}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.home.recentOrdersSubtitle}</p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10">
                {t.dashboard.home.viewAll} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="p-0 flex-1">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">ID</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.orders.table.table}</th>
                      <th className="text-left font-semibold text-muted-foreground py-4 px-6">{t.dashboard.orders.table.customer}</th>
                      <th className="text-right font-semibold text-muted-foreground py-4 px-6">{t.dashboard.orders.table.amount}</th>
                      <th className="text-center font-semibold text-muted-foreground py-4 px-6">{t.dashboard.orders.table.status}</th>
                      <th className="text-right font-semibold text-muted-foreground py-4 px-6">{t.dashboard.orders.table.time}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-6 font-bold text-foreground">{order.orderId}</td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">{order.tableNumber || '-'}</td>
                        <td className="py-4 px-6 font-medium text-muted-foreground">{order.customer || 'Guest'}</td>
                        <td className="py-4 px-6 text-right font-bold text-foreground">{formatCurrency(order.totalAmount, currency)}</td>
                        <td className="py-4 px-6 text-center">
                          <Badge className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border-0 ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right text-muted-foreground font-medium flex items-center justify-end">
                          <Clock className="w-3.5 h-3.5 mr-1.5 opacity-50" /> {order.createdAt}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground font-medium border-0">{t.dashboard.orders.noOrders}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ───── QUICK ACTIONS & SUMMARY BENTO ───── */}
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.home.quickActions}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.home.quickActionsSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link href="/dashboard/menu" className="group p-4 rounded-2xl border border-border/50 bg-muted/30 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col items-center justify-center gap-3 text-center">
               <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                 <UtensilsCrossed className="w-5 h-5 text-amber-600 dark:text-amber-400" />
               </div>
               <span className="text-xs font-bold text-foreground">{t.dashboard.home.updateMenu}</span>
            </Link>
            <Link href="/dashboard/qr-codes" className="group p-4 rounded-2xl border border-border/50 bg-muted/30 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col items-center justify-center gap-3 text-center">
               <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                 <QrCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
               </div>
               <span className="text-xs font-bold text-foreground">{t.dashboard.home.generateQr}</span>
            </Link>
            <Link href="/dashboard/marketing" className="group p-4 rounded-2xl border border-border/50 bg-muted/30 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col items-center justify-center gap-3 text-center">
               <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                 <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
               </div>
               <span className="text-xs font-bold text-foreground">{t.dashboard.home.createCampaign}</span>
            </Link>
            <Link href="/dashboard/customers" className="group p-4 rounded-2xl border border-border/50 bg-muted/30 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col items-center justify-center gap-3 text-center">
               <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                 <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
               </div>
               <span className="text-xs font-bold text-foreground">{t.dashboard.home.viewCustomers}</span>
            </Link>
          </div>

          <div className="mt-auto bg-muted/40 p-5 rounded-2xl border border-border/50">
            <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
               <Activity className="w-3.5 h-3.5" />
               {t.dashboard.home.todaysSummary}
            </h4>
            <div className="space-y-3">
              {[
                { label: t.dashboard.home.openOrders, value: String(todaySummary.openOrders), highlight: true },
                { label: t.dashboard.home.completed, value: String(todaySummary.completed), highlight: false },
                { label: t.dashboard.home.newCustomers, value: String(todaySummary.newCustomers), highlight: false },
                { label: t.dashboard.home.avgPrepTime, value: '8m 30s', highlight: false },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  <Badge variant={item.highlight ? 'default' : 'secondary'} className={`font-bold ${item.highlight ? 'bg-amber-500 hover:bg-amber-600' : 'bg-background'}`}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}