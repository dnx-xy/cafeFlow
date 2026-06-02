'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  Clock,
  QrCode,
  BarChart3,
  ArrowRight,
  Activity,
  Percent,
} from 'lucide-react';
import { useOrders, useCustomers } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 2400, orders: 24 },
  { name: 'Tue', revenue: 1398, orders: 18 },
  { name: 'Wed', revenue: 9800, orders: 42 },
  { name: 'Thu', revenue: 3908, orders: 32 },
  { name: 'Fri', revenue: 4800, orders: 38 },
  { name: 'Sat', revenue: 3800, orders: 35 },
  { name: 'Sun', revenue: 4300, orders: 40 },
];

const topProducts = [
  { name: 'Caramel Macchiato', sales: 142, revenue: 1988, trend: 'up' },
  { name: 'Avocado Toast', sales: 98, revenue: 1372, trend: 'up' },
  { name: 'Cold Brew', sales: 87, revenue: 1087, trend: 'down' },
  { name: 'Eggs Benedict', sales: 76, revenue: 1368, trend: 'up' },
  { name: 'Matcha Latte', sales: 65, revenue: 910, trend: 'up' },
];

export default function DashboardPage() {
  const { currency } = useCurrency();
  const { orders, loading: ordersLoading, fetchOrders } = useOrders();
  const { customers, loading: customersLoading, fetchCustomers } = useCustomers();
  const [stats, setStats] = useState({
    revenue: 24580,
    orders: 1247,
    customers: 892,
    qrScans: 3842,
    returning: 42,
    avgOrder: 19.72,
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Good morning, John 👋</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening at The Daily Grind today.</p>
        </div>
        <Badge variant="outline" className="text-xs font-normal text-gray-500 dark:text-gray-400">
          <Activity className="w-3 h-3 mr-1.5" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { title: 'Revenue', value: formatCurrency(stats.revenue, currency), change: '+12%', icon: DollarSign, trend: 'up' as const },
          { title: 'Orders', value: stats.orders.toLocaleString(), change: '+8%', icon: ShoppingCart, trend: 'up' as const },
          { title: 'Customers', value: stats.customers.toLocaleString(), change: '+5%', icon: Users, trend: 'up' as const },
          { title: 'QR Scans', value: stats.qrScans.toLocaleString(), change: '+24%', icon: QrCode, trend: 'up' as const },
          { title: 'Returning', value: `${stats.returning}%`, change: '+5%', icon: Award, trend: 'up' as const },
          { title: 'Avg Order', value: formatCurrency(stats.avgOrder, currency), change: '-2%', icon: Percent, trend: 'down' as const },
        ].map((kpi, i) => (
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
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daily revenue and orders this week</p>
            </div>
            <Badge variant="outline" className="text-[11px] font-normal text-gray-500 dark:text-gray-400">This Week</Badge>
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Products</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Best selling items today</p>
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
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{product.sales} sold</p>
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
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Latest orders from your cafe</p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="ml-1 w-3 h-3" />
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
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Order</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Table</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Customer</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Amount</th>
                      <th className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Status</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3">Time</th>
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
                        <td colSpan={6} className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No orders yet</td>
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Frequently used actions</p>
          </div>
          <div className="p-5 pt-3">
            <div className="space-y-2">
              <Link href="/dashboard/menu">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <BarChart3 className="mr-2.5 w-4 h-4 text-gray-400" /> Update Menu
                </Button>
              </Link>
              <Link href="/dashboard/qr-codes">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <QrCode className="mr-2.5 w-4 h-4 text-gray-400" /> Generate QR Codes
                </Button>
              </Link>
              <Link href="/dashboard/marketing">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Award className="mr-2.5 w-4 h-4 text-gray-400" /> Create Campaign
                </Button>
              </Link>
              <Link href="/dashboard/customers">
                <Button variant="outline" className="w-full justify-start text-sm h-9">
                  <Users className="mr-2.5 w-4 h-4 text-gray-400" /> View Customers
                </Button>
              </Link>
            </div>

            <Separator className="my-4 bg-gray-100 dark:bg-gray-800/50" />

            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Today&apos;s Summary</h4>
              <div className="space-y-2.5">
                {[
                  ['Open Orders', '12'],
                  ['Completed', '89'],
                  ['New Customers', '24'],
                  ['Avg Prep Time', '8 min'],
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
