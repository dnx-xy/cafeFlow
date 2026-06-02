'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target,
  Clock, ArrowUpRight, ArrowDownRight, BarChart3, Percent, RefreshCw
} from 'lucide-react';
import { useAnalytics, AnalyticsData } from '@/hooks/useAnalytics';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ef4444', '#8b5cf6', '#ec4899'];

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
}

function KPICard({ title, value, change, icon: Icon, color, prefix }: KPICardProps) {
  const isUp = change >= 0;
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className={`text-xs font-medium ${isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5 inline" /> : <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />}
            {Math.abs(change)}%
          </Badge>
        </div>
        <div className="text-2xl font-bold text-foreground">{prefix}{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{title}</div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, loading, error, fetchAnalytics } = useAnalytics();
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchAnalytics} variant="outline">Retry</Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Track your café&apos;s key metrics and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Revenue" value={`$${data.revenue.total.toLocaleString()}`} change={data.revenue.change} icon={DollarSign} color="bg-green-100 text-green-600" prefix="$" />
        <KPICard title="Orders" value={data.orders.total.toLocaleString()} change={data.orders.change} icon={ShoppingCart} color="bg-blue-100 text-blue-600" />
        <KPICard title="Customers" value={data.customers.total.toLocaleString()} change={data.customers.change} icon={Users} color="bg-purple-100 text-purple-600" />
        <KPICard title="Avg Order" value={`$${data.avgOrderValue.value.toFixed(2)}`} change={data.avgOrderValue.change} icon={Target} color="bg-indigo-100 text-indigo-600" />
        <KPICard title="Conversion" value={`${data.conversionRate.value}%`} change={data.conversionRate.change} icon={Percent} color="bg-rose-100 text-rose-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenue & Orders Trend</CardTitle>
                <CardDescription>Daily performance over the selected period</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChart}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={false} name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Peak Hours</CardTitle>
                <CardDescription>Orders by hour</CardDescription>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="orders" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Items */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Selling Items</CardTitle>
            <CardDescription>Best performers this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sales} sold · ${item.revenue}</p>
                    </div>
                  </div>
                  <div className={item.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Retention */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Customer Retention</CardTitle>
            <CardDescription>New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Returning', value: data.customerRetention.returningCustomers },
                      { name: 'New', value: data.customerRetention.newCustomers },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[COLORS[1], COLORS[2]].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-2xl font-bold text-foreground">{data.customerRetention.rate}%</p>
              <p className="text-xs text-muted-foreground">Retention Rate</p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            <CardDescription>Summary at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Revenue" value={`$${(data.revenue.total * 1.5).toLocaleString()}`} sub="This month" />
              <StatCard label="Avg Daily Orders" value={Math.round(data.orders.total / 30).toString()} sub="Last 30 days" />
              <StatCard label="Peak Hour" value="09:00" sub="32 orders avg" />
              <StatCard label="Avg Prep Time" value="8 min" sub="Across all items" />
              <StatCard label="Table Turnover" value="45 min" sub="Average per table" />
              <StatCard label="Top Category" value="Coffee" sub="42% of sales" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
