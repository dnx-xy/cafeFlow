"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Clock, MapPin, Coffee, UtensilsCrossed,
  Share2, Home, Star, QrCode, Banknote, MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format-idr";

interface OrderDetails {
  id: string;
  orderId: string;
  estimatedTime: string;
  items: Array<{ name?: string; itemName?: string; quantity: number; totalPrice: number; price?: number }>;
  totalAmount: number;
  finalAmount: number;
  tableNumber: string;
  status: string;
  paymentMethod?: string;
}

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cafeName, setCafeName] = useState('Warung Kopi Nusantara');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('last_order');
      const cafeRaw = localStorage.getItem('cafe_info');
      if (cafeRaw) {
        try { const info = JSON.parse(cafeRaw); setCafeName(info.name || 'Warung Kopi Nusantara'); } catch {}
      }
      if (raw) {
        const order = JSON.parse(raw);
        setOrderDetails({
          id: order.id,
          orderId: order.orderId || order.id?.slice(0, 8).toUpperCase(),
          estimatedTime: '15-20 menit',
          items: order.orderItems || order.items || [],
          totalAmount: order.totalAmount || 0,
          finalAmount: order.finalAmount || order.totalAmount || 0,
          tableNumber: order.tableNumber || 'N/A',
          status: order.status || 'PENDING',
          paymentMethod: order.paymentMethod || 'QRIS',
        });
      }
    } catch {}
    setLoading(false);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Pesanan Saya", text: `Saya baru memesan! Order #${orderDetails?.orderId}` });
    }
  };

  const paymentIcon = (method?: string) => {
    switch (method) {
      case 'CASH': return <Banknote className="h-4 w-4" />;
      case 'WA_TRANSFER': return <MessageCircle className="h-4 w-4" />;
      default: return <QrCode className="h-4 w-4" />;
    }
  };

  const paymentLabel = (method?: string) => {
    switch (method) {
      case 'CASH': return 'Tunai';
      case 'WA_TRANSFER': return 'WA Transfer';
      default: return 'QRIS';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-b from-green-50 to-background px-4 pb-6 pt-12">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 animate-in items-center justify-center rounded-full bg-green-100 fade-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="animate-in text-xl font-bold text-foreground slide-in-from-bottom duration-500 delay-100">
            Pesanan Dikonfirmasi!
          </h1>
          <p className="mt-1 animate-in text-center text-sm text-muted-foreground slide-in-from-bottom duration-500 delay-200">
            Pesanan Anda telah diterima dan sedang disiapkan
          </p>
        </div>
      </div>

      <div className="px-4 pb-24">
        <Card className="mb-4 animate-in overflow-hidden border-0 shadow-md slide-in-from-bottom duration-500 delay-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Nomor Pesanan</p>
                <p className="text-lg font-bold tracking-wide">{orderDetails?.orderId || '------'}</p>
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimasi</p>
                  <p className="text-sm font-semibold">{orderDetails?.estimatedTime || '15-20 menit'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meja</p>
                  <p className="text-sm font-semibold">#{orderDetails?.tableNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  {paymentIcon(orderDetails?.paymentMethod)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pembayaran</p>
                  <p className="text-sm font-semibold">{paymentLabel(orderDetails?.paymentMethod)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-4 text-sm font-semibold">Status Pesanan</h3>
            <div className="relative">
              <div className="absolute bottom-4 left-3 top-8 w-0.5 bg-amber-500" />
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pesanan Dikonfirmasi</p>
                  <p className="text-xs text-muted-foreground">Pesanan Anda telah diterima</p>
                </div>
              </div>
              <div className="relative flex gap-4 pb-6">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <UtensilsCrossed className="h-3 w-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sedang Disiapkan</p>
                  <p className="text-xs text-muted-foreground">Koki kami sedang memasak</p>
                </div>
              </div>
              <div className="relative flex gap-4">
                <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <Coffee className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Siap Disajikan</p>
                  <p className="text-xs text-muted-foreground">Kami akan memberitahu jika siap</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {orderDetails?.paymentMethod === 'QRIS' && (
          <Card className="mb-4 border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Bayar dengan QRIS</p>
                  <p className="text-xs text-muted-foreground">Scan QRIS di kasir untuk menyelesaikan pembayaran</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Ringkasan Pesanan</h3>
            <div className="space-y-2">
              {(orderDetails?.items || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.quantity}x</span>
                    <span>{item.itemName || item.name || 'Menu'}</span>
                  </div>
                  <span className="text-muted-foreground">{formatIDR(item.totalPrice || item.price || 0)}</span>
                </div>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold text-amber-600">{formatIDR(orderDetails?.finalAmount || orderDetails?.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {orderDetails?.paymentMethod === 'CASH' && (
          <Card className="mb-4 border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  <Banknote className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Bayar Tunai</p>
                  <p className="text-xs text-muted-foreground">Siapkan {formatIDR(orderDetails?.finalAmount || orderDetails?.totalAmount || 0)} untuk dibayarkan di kasir</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-xs text-muted-foreground">Kami akan memberitahu Anda saat pesanan siap</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-3">
          <Link href="/menu" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Menu
            </Button>
          </Link>
          <Link href="/menu/review" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              <Star className="mr-2 h-4 w-4" />
              Beri Penilaian
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
