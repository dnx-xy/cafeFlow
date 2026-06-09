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
    <div className="bg-card rounded-3xl border border-border/50 p-6 hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <Badge variant="outline" className={`px-2 py-1 text-xs font-bold border-0 ${up ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' : 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30'}`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
          {Math.abs(change)}%
        </Badge>
      </div>
      <div>
        <div className="text-3xl font-extrabold text-foreground tracking-tight mb-1">{value}</div>
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
      </div>
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
            <TabsList className="h-11 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="week" className="text-sm font-semibold rounded-lg px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">{t.dashboard.analytics.week}</TabsTrigger>
              <TabsTrigger value="month" className="text-sm font-semibold rounded-lg px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">{t.dashboard.analytics.month}</TabsTrigger>
              <TabsTrigger value="year" className="text-sm font-semibold rounded-lg px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">{t.dashboard.analytics.year}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="w-11 h-11 rounded-xl border-border/50 shadow-sm" onClick={() => fetchAnalytics(period as any)}>
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border/50 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.analytics.revenueTrend}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.analytics.revenueTrendSubtitle}</p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-semibold">Last 7 days</Badge>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t.dashboard.analytics.peakHours}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.analytics.peakHoursSubtitle}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.peakHours} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.analytics.topItems}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.analytics.topItemsSubtitle}</p>
          </div>
          <div className="space-y-4">
            {data.topItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : i === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : i === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">{item.name}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{item.sales} sold <span className="mx-1">•</span> <span className="font-semibold text-foreground">{formatCurrency(item.revenue, currency)}</span></p>
                  </div>
                </div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                  {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.analytics.customerRetention}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.analytics.retentionSubtitle}</p>
          </div>
          <div className="flex-1 flex flex-col relative min-h-[250px]">
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10 pb-6">
              <span className="text-4xl font-extrabold text-foreground">{data.customerRetention.rate}%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">{t.dashboard.analytics.retentionRate}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Returning', value: data.customerRetention.returningCustomers },
                  { name: 'New', value: data.customerRetention.newCustomers },
                ]}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none"
                >
                  {[COLORS[1], COLORS[0]].map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} itemStyle={{ fontWeight: 'bold' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">{t.dashboard.analytics.quickStats}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t.dashboard.analytics.quickStatsSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [t.dashboard.analytics.totalRevenue, formatCurrency(data.revenue.total * 1.5, currency), t.dashboard.analytics.month],
              [t.dashboard.analytics.avgDailyOrders, Math.round(data.orders.total / 30).toString(), 'Last 30 days'],
              [t.dashboard.analytics.peakHour, '09:00', '32 orders avg'],
              [t.dashboard.analytics.avgPrepTime, '8 min', 'Across all items'],
              [t.dashboard.analytics.tableTurnover, '45 min', 'Average per table'],
              [t.dashboard.analytics.topCategory, 'Coffee', '42% of sales'],
            ].map(([label, value, sub]) => (
              <div key={label} className="bg-muted/40 rounded-2xl p-4 border border-border/50 hover:bg-muted/60 transition-colors">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
                <p className="text-xl font-extrabold text-foreground mb-1">{value}</p>
                <p className="text-xs font-medium text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}