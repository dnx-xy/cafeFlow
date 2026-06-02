"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Minus, Trash2, Coffee, CreditCard, Clock,
  MapPin, MessageCircle, ShoppingBag, Banknote, QrCode,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMenuCart } from "@/hooks/useMenuCart";
import { usePublicOrder } from "@/hooks/usePublicOrder";
import { generateWhatsAppMessage } from "@/lib/whatsapp";
import { formatIDR } from "@/lib/format-idr";

type PaymentMethod = 'QRIS' | 'CASH' | 'WA_TRANSFER';

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, count, subtotal, updateQuantity, removeItem, clearCart } = useMenuCart();
  const { submitOrder } = usePublicOrder();
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [cafeInfo, setCafeInfo] = useState<{ name: string; tableNumber: string; phoneNumber?: string }>({ name: 'Warung Kopi Nusantara', tableNumber: '1' });
  const [tableId, setTableId] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('cafe_info');
    if (stored) {
      try {
        const info = JSON.parse(stored);
        setCafeInfo({ name: info.name || 'Warung Kopi Nusantara', tableNumber: info.tableNumber || '1', phoneNumber: info.phoneNumber });
      } catch {}
    }
    setTableId(localStorage.getItem('cafe_table_id') || '');
  }, []);

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const handleWhatsApp = () => {
    const url = generateWhatsAppMessage(cartItems, cafeInfo.tableNumber, orderNotes, cafeInfo.name, cafeInfo.phoneNumber);
    window.open(url, '_blank');
    toast.success("WhatsApp terbuka dengan pesanan Anda");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) { toast.error("Keranjang kosong"); return; }
    if (!tableId) { toast.error("Informasi meja tidak ditemukan. Silakan scan ulang QR."); return; }
    setSubmitting(true);
    try {
      const orderData = {
        tableId,
        items: cartItems.map(i => ({
          menuItemId: i.id,
          quantity: i.quantity,
          notes: i.customization ? Object.values(i.customization).filter(Boolean).join(', ') : '',
          options: [],
        })),
        notes: orderNotes,
        paymentMethod,
      };
      const result = await submitOrder(orderData);
      localStorage.setItem('last_order', JSON.stringify({ ...result, paymentMethod }));
      toast.success("Pesanan berhasil!");
      clearCart();
      router.push("/menu/confirmation");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memproses pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  const getCustomizationString = (item: typeof cartItems[0]) => {
    if (!item.customization) return "";
    return Object.values(item.customization).filter(Boolean).join(" | ");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Keranjang</h1>
            <p className="text-xs text-muted-foreground">{count} item</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Coffee className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">{cafeInfo.name}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Meja #{cafeInfo.tableNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>~15-20 menit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {cartItems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Coffee className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium">Keranjang kosong</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tambahkan menu favorit Anda</p>
            <Link href="/menu">
              <Button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500">
                Lihat Menu
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <Card key={item.id + '-' + idx} className="overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Coffee className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            {getCustomizationString(item) && (
                              <p className="text-xs text-muted-foreground">{getCustomizationString(item)}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id, item.customization)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm font-bold text-amber-600">{formatIDR(item.price * item.quantity)}</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-border/50" onClick={() => updateQuantity(item.id, -1, item.customization)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-border/50" onClick={() => updateQuantity(item.id, 1, item.customization)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Link href="/menu" className="flex-1">
                <Button variant="outline" className="w-full border-dashed border-border/50 text-muted-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah lagi
                </Button>
              </Link>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                WA Order
              </Button>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">Catatan Pesanan</label>
              <Textarea placeholder="Ada permintaan khusus? (misal: tidak pedas, ekstra sambal, dll)" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className="min-h-[80px] resize-none border-border/50 bg-card" />
            </div>

            <div className="mt-4">
              <h3 className="mb-3 text-sm font-semibold">Metode Pembayaran</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={paymentMethod === 'QRIS' ? 'default' : 'outline'} size="sm" className={paymentMethod === 'QRIS' ? 'bg-amber-500 hover:bg-amber-600' : 'border-border/50'} onClick={() => setPaymentMethod('QRIS')}>
                  <QrCode className="mr-1.5 h-4 w-4" />QRIS
                </Button>
                <Button variant={paymentMethod === 'CASH' ? 'default' : 'outline'} size="sm" className={paymentMethod === 'CASH' ? 'bg-amber-500 hover:bg-amber-600' : 'border-border/50'} onClick={() => setPaymentMethod('CASH')}>
                  <Banknote className="mr-1.5 h-4 w-4" />Tunai
                </Button>
                <Button variant={paymentMethod === 'WA_TRANSFER' ? 'default' : 'outline'} size="sm" className={paymentMethod === 'WA_TRANSFER' ? 'bg-amber-500 hover:bg-amber-600' : 'border-border/50'} onClick={() => setPaymentMethod('WA_TRANSFER')}>
                  <MessageCircle className="mr-1.5 h-4 w-4" />WA Transfer
                </Button>
              </div>
              {paymentMethod === 'QRIS' && (
                <div className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                  Scan QRIS di kasir saat pembayaran
                </div>
              )}
              {paymentMethod === 'CASH' && (
                <div className="mt-2 rounded-lg bg-green-50 p-3 text-xs text-green-700">
                  Bayar tunai di kasir setelah pesanan siap
                </div>
              )}
              {paymentMethod === 'WA_TRANSFER' && (
                <div className="mt-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                  Kami akan kirim nomor rekening via WhatsApp
                </div>
              )}
            </div>

            <Card className="mt-4 border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="mb-3 text-sm font-semibold">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PPN (8%)</span>
                    <span>{formatIDR(tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-amber-600">{formatIDR(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center gap-3">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 px-3" onClick={handleWhatsApp}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-amber-600">{formatIDR(total)}</p>
            </div>
            <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600" onClick={handleCheckout} disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : 'Pesan Sekarang'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
