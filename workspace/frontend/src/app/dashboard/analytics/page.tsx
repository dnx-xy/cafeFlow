'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target,
  Clock, ArrowUpRight, ArrowDownRight, BarChart3, Percent, Activity, RefreshCw,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/i18n/context';
import { formatCurrency } from '@/lib/currency';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ef4444', '#8b5cf6', '#ec4899'];

function KpiCard({ title, value, change, icon: Icon }: {
  title: string; value: string; change: number; icon: React.ElementType;
}) {
  const up = change >= 0;
  return (
    <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
        </div>
        <Badge variant="outline" className={`text-[10px] font-medium ${up ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`}>
          {up ? <ArrowUpRight className="w-3 h-3 mr-0.5 inline" /> : <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />}
          {Math.abs(change)}%
        </Badge>
      </div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{title}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { currency } = useCurrency();
  const { t } = useI18n();
  const { data, loading, error, fetchAnalytics } = useAnalytics();
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchAnalytics(period as 'week' | 'month' | 'year');
  }, [period, fetchAnalytics]);

  if (loading && !data) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-64 gap-3"><p className="text-red-500 text-sm">{error}</p><Button variant="outline" size="sm" onClick={() => fetchAnalytics(period as any)}>Retry</Button></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.dashboard.analytics.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs px-3">{t.dashboard.analytics.week}</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">{t.dashboard.analytics.month}</TabsTrigger>
              <TabsTrigger value="year" className="text-xs px-3">{t.dashboard.analytics.year}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => fetchAnalytics(period as any)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard title={t.dashboard.analytics.revenue} value={formatCurrency(data.revenue.total, currency)} change={data.revenue.change} icon={DollarSign} />
        <KpiCard title={t.dashboard.analytics.orders} value={data.orders.total.toLocaleString()} change={data.orders.change} icon={ShoppingCart} />
        <KpiCard title={t.dashboard.analytics.customers} value={data.customers.total.toLocaleString()} change={data.customers.change} icon={Users} />
        <KpiCard title={t.dashboard.analytics.avgOrder} value={formatCurrency(data.avgOrderValue.value, currency)} change={data.avgOrderValue.change} icon={Target} />
        <KpiCard title={t.dashboard.analytics.conversion} value={`${data.conversionRate.value}%`} change={data.conversionRate.change} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.revenueTrend}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.analytics.revenueTrendSubtitle}</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-normal">Last 7 days</Badge>
          </div>
          <div className="p-5 pt-3">
            <div className="h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChart}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={false} name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.peakHours}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.analytics.peakHoursSubtitle}</p>
            </div>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5 pt-3">
            <div className="h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="px-5 pt-5 pb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.topItems}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.analytics.topItemsSubtitle}</p>
          </div>
          <div className="p-5 pt-3">
            <div className="space-y-3.5">
              {data.topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 dark:bg-gray-800/60 rounded-lg flex items-center justify-center text-[11px] font-bold text-gray-400">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{item.sales} sold · {formatCurrency(item.revenue, currency)}</p>
                    </div>
                  </div>
                  <div className={item.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="px-5 pt-5 pb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.customerRetention}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.analytics.retentionSubtitle}</p>
          </div>
          <div className="p-5 pt-3">
            <div className="h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Returning', value: data.customerRetention.returningCustomers },
                    { name: 'New', value: data.customerRetention.newCustomers },
                  ]}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value"
                  >
                    {[COLORS[1], COLORS[2]].map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{data.customerRetention.rate}%</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{t.dashboard.analytics.retentionRate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
          <div className="px-5 pt-5 pb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.dashboard.analytics.quickStats}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.dashboard.analytics.quickStatsSubtitle}</p>
          </div>
          <div className="p-5 pt-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                [t.dashboard.analytics.totalRevenue, formatCurrency(data.revenue.total * 1.5, currency), t.dashboard.analytics.month],
                [t.dashboard.analytics.avgDailyOrders, Math.round(data.orders.total / 30).toString(), 'Last 30 days'],
                [t.dashboard.analytics.peakHour, '09:00', '32 orders avg'],
                [t.dashboard.analytics.avgPrepTime, '8 min', 'Across all items'],
                [t.dashboard.analytics.tableTurnover, '45 min', 'Average per table'],
                [t.dashboard.analytics.topCategory, 'Coffee', '42% of sales'],
              ].map(([label, value, sub]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-3">
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}