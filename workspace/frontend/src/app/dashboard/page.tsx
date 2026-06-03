'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Award, Clock, QrCode, BarChart3, ArrowRight, Activity, Percent,
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
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    PREPARING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    READY: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    DELIVERED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.home.greeting.replace('{{name}}', user?.name || 'User')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.home.subtitle.replace('{{cafe}}', user?.name || 'Your Cafe')}</p>
        </div>
        <Badge variant="outline" className="text-xs font-normal text-gray-500 dark:text-gray-400">
          <Activity className="w-3 h-3 mr-1.5" />
          {t.dashboard.home.live}
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {([
          { title: t.dashboard.home.revenue, value: formatCurrency(stats.revenue, currency), change: '+12%', icon: DollarSign, trend: 'up' as const },
          { title: t.dashboard.home.orders, value: stats.orders.toLocaleString(), change: '+8%', icon: ShoppingCart, trend: 'up' as const },
          { title: t.dashboard.home.customers, value: stats.customers.toLocaleString(), change: '+5%', icon: Users, trend: 'up' as const },
          { title: t.dashboard.home.qrScans, value: stats.qrScans.toLocaleString(), change: '+24%', icon: QrCode, trend: 'up' as const },
          { title: t.dashboard.home.returning, value: `${stats.returning}%`, change: '+5%', icon: Award, trend: 'up' as const },
          { title: t.dashboard.home.avgOrder, value: formatCurrency(stats.avgOrder, currency), change: '-2%', icon: Percent, trend: 'down' as const },
        ] as const).map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                <kpi.icon className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className={`flex items-center text-[11px] font-medium ${kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {kpi.change}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500">{kpi.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.home.revenueOverview}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.home.revenueSubtitle}</p>
            </div>
            <Badge variant="outline" className="text-[11px] font-normal text-gray-500 dark:text-gray-400">{t.dashboard.home.thisWeek}</Badge>
          </div>
          <div className="p-5 pt-2">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    formatter={(value: number) => [formatCurrency(value, currency), 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.home.topProducts}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.home.topProductsSubtitle}</p>
          </div>
          <div className="p-5 pt-3">
            <div className="space-y-3.5">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 dark:bg-gray-800/60 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{product.sales} {t.dashboard.home.sold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(product.revenue, currency)}</p>
                    <div className={`flex items-center justify-end text-[11px] ${product.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {product.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.home.recentOrders}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.home.recentOrdersSubtitle}</p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-xs">
                {t.dashboard.home.viewAll} <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="p-5 pt-2">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800/50">
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.order}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.table}</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.customer}</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.amount}</th>
                      <th className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.status}</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">{t.dashboard.orders.table.time}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{order.orderId}</td>
                        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{order.tableNumber || 'N/A'}</td>
                        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{order.customer || 'N/A'}</td>
                        <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount, currency)}</td>
                        <td className="py-3 text-center">
                          <Badge variant="outline" className={`text-[10px] font-medium capitalize ${statusColors[order.status] || ''}`}>
                            {order.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-right text-gray-400 dark:text-gray-500 flex items-center justify-end">
                          <Clock className="w-3 h-3 mr-1" /> {order.createdAt}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t.dashboard.orders.noOrders}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="px-5 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.home.quickActions}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.home.quickActionsSubtitle}</p>
          </div>
          <div className="p-5 pt-3">
            <div className="space-y-2">
              <Link href="/dashboard/menu">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <BarChart3 className="mr-2.5 w-4 h-4 text-gray-400" /> {t.dashboard.home.updateMenu}
                </Button>
              </Link>
              <Link href="/dashboard/qr-codes">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <QrCode className="mr-2.5 w-4 h-4 text-gray-400" /> {t.dashboard.home.generateQr}
                </Button>
              </Link>
              <Link href="/dashboard/marketing">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Award className="mr-2.5 w-4 h-4 text-gray-400" /> {t.dashboard.home.createCampaign}
                </Button>
              </Link>
              <Link href="/dashboard/customers">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Users className="mr-2.5 w-4 h-4 text-gray-400" /> {t.dashboard.home.viewCustomers}
                </Button>
              </Link>
            </div>

            <Separator className="my-4 bg-gray-100 dark:bg-gray-800/50" />

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t.dashboard.home.todaysSummary}</h4>
              <div className="space-y-2.5">
                {[
                  [t.dashboard.home.openOrders, String(todaySummary.openOrders)],
                  [t.dashboard.home.completed, String(todaySummary.completed)],
                  [t.dashboard.home.newCustomers, String(todaySummary.newCustomers)],
                  [t.dashboard.home.avgPrepTime, '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}