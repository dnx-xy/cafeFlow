'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download, Printer, ArrowLeft, Clock, MapPin, CreditCard, 
  Package, CheckCircle, XCircle, AlertCircle, User, Phone, Mail,
  ChevronRight, FileText, UtensilsCrossed, Coffee, Store
} from 'lucide-react';
import { useOrders } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { printOrderReceipt, exportOrder } from '@/lib/orderExportUtils';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currency } = useCurrency();
  const { fetchOrderById, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(params.id as string);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  const handleStatusChange = async (status: string) => {
    try {
      const updatedOrder = await updateOrderStatus(params.id as string, status);
      setOrder(updatedOrder);
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handlePrintReceipt = () => {
    if (order) {
      printOrderReceipt(order);
    }
  };

  const handleExportOrder = async (format: 'csv' | 'xlsx' | 'pdf' | 'jpg') => {
    if (order) {
      await exportOrder(order, format);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
      PENDING: { 
        color: 'text-amber-700 dark:text-amber-400', 
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        icon: <Clock className="w-3.5 h-3.5" />,
        label: 'Pending'
      },
      CONFIRMED: { 
        color: 'text-blue-700 dark:text-blue-400', 
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Confirmed'
      },
      PREPARING: { 
        color: 'text-indigo-700 dark:text-indigo-400', 
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        border: 'border-indigo-200 dark:border-indigo-500/20',
        icon: <Package className="w-3.5 h-3.5" />,
        label: 'Preparing'
      },
      READY: { 
        color: 'text-green-700 dark:text-green-400', 
        bg: 'bg-green-50 dark:bg-green-500/10',
        border: 'border-green-200 dark:border-green-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Ready'
      },
      DELIVERED: { 
        color: 'text-gray-700 dark:text-gray-400', 
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        border: 'border-gray-200 dark:border-gray-500/20',
        icon: <Package className="w-3.5 h-3.5" />,
        label: 'Delivered'
      },
      COMPLETED: { 
        color: 'text-emerald-700 dark:text-emerald-400', 
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: 'Completed'
      },
      CANCELLED: { 
        color: 'text-red-700 dark:text-red-400', 
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-200 dark:border-red-500/20',
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: 'Cancelled'
      },
    };
    return configs[status] || { 
      color: 'text-gray-700 dark:text-gray-400', 
      bg: 'bg-gray-50 dark:bg-gray-500/10',
      border: 'border-gray-200 dark:border-gray-500/20',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: status
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/dashboard/orders')} variant="outline" className="border-rose-200 hover:bg-rose-50">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => router.push('/dashboard/orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{order.orderId}
              </h1>
              <Badge variant="outline" className={`text-xs font-medium capitalize ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                {statusConfig.icon}
                <span className="ml-1">{statusConfig.label}</span>
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 hover:bg-gray-50" onClick={handlePrintReceipt}>
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print
          </Button>
          <Button size="sm" className="h-8 text-xs bg-rose-500 hover:bg-rose-600 text-white" onClick={() => handleExportOrder('pdf')}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Info */}
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-rose-500" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Type</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {order.orderType?.toLowerCase().replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Table</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.tableNumber || 'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment</p>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span className={`text-sm font-medium ${
                      order.paymentStatus === 'PAID' ? 'text-green-600 dark:text-green-400' :
                      order.paymentStatus === 'PENDING' ? 'text-amber-600 dark:text-amber-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-rose-500" />
                  Order Items
                </CardTitle>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {order.items?.length || 0} items
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                            <Coffee className="w-3.5 h-3.5 text-rose-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{item.itemName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatCurrency(item.unitPrice, currency)} each
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-4">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {formatCurrency(item.totalPrice, currency)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                    No items found for this order
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">-</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(order.totalAmount, currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{order.customer || 'Guest Customer'}</p>
                  <div className="mt-1.5 space-y-1">
                    {order.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3.5 h-3.5" />
                        {order.email}
                      </div>
                    )}
                    {order.phoneNumber && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3.5 h-3.5" />
                        {order.phoneNumber}
                      </div>
                    )}
                    {!order.email && !order.phoneNumber && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No contact information provided</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status Actions */}
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {order.status === 'PENDING' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-xs h-8"
                    onClick={() => handleStatusChange('CONFIRMED')}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                      Confirm Order
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                )}
                {order.status === 'CONFIRMED' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-xs h-8"
                    onClick={() => handleStatusChange('PREPARING')}
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-indigo-500" />
                      Mark Preparing
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-xs h-8"
                    onClick={() => handleStatusChange('READY')}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      Mark Ready
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                )}
                {(order.status !== 'CANCELLED' && order.status !== 'COMPLETED') && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-xs h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    onClick={() => handleStatusChange('CANCELLED')}
                  >
                    <span className="flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Order
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                )}
                {(order.status === 'CANCELLED' || order.status === 'COMPLETED') && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                    Order is {order.status.toLowerCase()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => await handleExportOrder('csv')}
                >
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => await handleExportOrder('xlsx')}
                >
                  Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => await handleExportOrder('pdf')}
                >
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => await handleExportOrder('jpg')}
                >
                  Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}