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
  Star,
  Clock,
  QrCode,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useOrders, useCustomers } from '@/hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders } = useOrders();
  const { customers, loading: customersLoading, error: customersError, fetchCustomers } = useCustomers();
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    qrScans: 0,
    returning: 0,
    avgOrder: 0
  });

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    
    // Set sample stats for now (in a real app, this would come from API)
    setStats({
      revenue: 24580,
      orders: 1247,
      customers: 892,
      qrScans: 3842,
      returning: 42,
      avgOrder: 19.72
    });
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    PREPARING: 'bg-blue-100 text-blue-800 border-blue-200',
    READY: 'bg-green-100 text-green-800 border-green-200',
    DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200',
    COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { 
            title: 'Revenue', 
            value: `$${stats.revenue.toLocaleString()}`, 
            change: '+12%', 
            icon: DollarSign, 
            trend: 'up',
            color: 'bg-green-100 text-green-600'
          },
          { 
            title: 'Orders', 
            value: stats.orders.toLocaleString(), 
            change: '+8%', 
            icon: ShoppingCart, 
            trend: 'up',
            color: 'bg-blue-100 text-blue-600'
          },
          { 
            title: 'Customers', 
            value: stats.customers.toLocaleString(), 
            change: '+5%', 
            icon: Users, 
            trend: 'up',
            color: 'bg-purple-100 text-purple-600'
          },
          { 
            title: 'QR Scans', 
            value: stats.qrScans.toLocaleString(), 
            change: '+24%', 
            icon: QrCode, 
            trend: 'up',
            color: 'bg-amber-100 text-amber-600'
          },
          { 
            title: 'Returning', 
            value: `${stats.returning}%`, 
            change: '+5%', 
            icon: Award, 
            trend: 'up',
            color: 'bg-rose-100 text-rose-600'
          },
          { 
            title: 'Avg Order', 
            value: `$${stats.avgOrder.toFixed(2)}`, 
            change: '-2%', 
            icon: TrendingUp, 
            trend: 'down',
            color: 'bg-indigo-100 text-indigo-600'
          },
        ].map((kpi, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Daily revenue and orders</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
            <p className="text-sm text-muted-foreground">Best selling items today</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.revenue}</p>
                    <div className={`flex items-center justify-end text-xs ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {product.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <p className="text-sm text-muted-foreground">Latest orders from your cafe</p>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                View all
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : ordersError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{ordersError}</p>
                <Button onClick={() => fetchOrders()}>Retry</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Order</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Table</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3">Items</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Amount</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3">Status</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 text-sm font-medium">{order.orderId}</td>
                        <td className="py-3 text-sm">{order.tableNumber || 'N/A'}</td>
                        <td className="py-3 text-sm">{order.customer || 'N/A'}</td>
                        <td className="py-3 text-sm">{order.items.length}</td>
                        <td className="py-3 text-sm text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 text-center">
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${statusColors[order.status] || ''}`}
                          >
                            {order.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-right text-muted-foreground flex items-center justify-end">
                          <Clock className="w-3 h-3 mr-1" />
                          {order.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Frequently used actions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/menu">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 w-4 h-4" />
                  Update Menu
                </Button>
              </Link>
              <Link href="/dashboard/qr-codes">
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="mr-2 w-4 h-4" />
                  Generate QR Codes
                </Button>
              </Link>
              <Link href="/dashboard/marketing">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="mr-2 w-4 h-4" />
                  Create Campaign
                </Button>
              </Link>
              <Link href="/dashboard/customers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 w-4 h-4" />
                  View Customers
                </Button>
              </Link>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Today's Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Orders</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New Customers</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Prep Time</span>
                  <span className="font-medium">8 min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}