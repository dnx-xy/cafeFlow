'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  MapPin
} from 'lucide-react';
import { useOrders } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { orders, loading, error, pagination, fetchOrders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '1,247', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
          { label: 'Today\'s Revenue', value: '$2,847', icon: ShoppingCart, color: 'bg-green-100 text-green-600' },
          { label: 'Pending Orders', value: '12', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Avg Order Value', value: '$19.72', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PREPARING">Preparing</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Orders</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchOrders()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Order ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Table</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Items</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Amount</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Status</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Payment</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Time</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{order.orderId}</span>
                            {order.orderType === 'TAKEAWAY' && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Takeaway
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                            {order.tableNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium">{order.customer || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{order.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{order.items.length} items</td>
                        <td className="py-4 text-right">
                          <span className="text-sm font-medium">${order.totalAmount.toFixed(2)}</span>
                        </td>
                        <td className="py-4 text-center">
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${statusColors[order.status] || ''}`}
                          >
                            {order.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`text-xs ${order.paymentStatus === 'PAID' ? 'text-green-600' : order.paymentStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-sm text-muted-foreground">{order.createdAt}</span>
                        </td>
                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              {order.status === 'PENDING' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}>
                                  <Check className="mr-2 w-4 h-4" />
                                  Confirm Order
                                </DropdownMenuItem>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'PREPARING')}>
                                  <Check className="mr-2 w-4 h-4" />
                                  Mark Preparing
                                </DropdownMenuItem>
                              )}
                              {order.status === 'PREPARING' && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'READY')}>
                                  <Check className="mr-2 w-4 h-4" />
                                  Mark Ready
                                </DropdownMenuItem>
                              )}
                              {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                >
                                  <X className="mr-2 w-4 h-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Printer className="mr-2 w-4 h-4" />
                                Print Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{filteredOrders.length}</span> orders
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}