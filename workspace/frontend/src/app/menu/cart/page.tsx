"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Minus, Trash2, Coffee, CreditCard, Clock,
  MapPin, MessageCircle, ShoppingBag, Banknote, QrCode,
  Loader2,
} from "lucide-react";
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

  const handleWhatsApp = async () => {
    if (cartItems.length === 0) { toast.error("Keranjang kosong"); return; }
    if (!tableId) { toast.error("Informasi meja tidak ditemukan"); return; }

    const orderData = {
      tableId,
      items: cartItems.map(i => ({
        menuItemId: i.id,
        quantity: i.quantity,
        notes: i.customization ? Object.values(i.customization).filter(Boolean).join(', ') : '',
        options: [],
      })),
      notes: orderNotes,
      paymentMethod: 'WA_TRANSFER',
      orderType: 'WHATSAPP',
    };

    try {
      await submitOrder(orderData);
      const url = generateWhatsAppMessage(cartItems, cafeInfo.tableNumber, orderNotes, cafeInfo.name, cafeInfo.phoneNumber);
      window.open(url, '_blank');
      toast.success("Pesanan via WhatsApp terkirim!");
      clearCart();
      router.push("/menu/confirmation");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengirim pesanan");
    }
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

  const baseBtn = (active: boolean) => ({
    padding: '10px 14px', borderRadius: 100, border: `1.5px solid ${active ? 'var(--menu-gold)' : 'var(--menu-card-border)'}`,
    background: active ? 'var(--menu-warm)' : 'var(--menu-card)',
    color: active ? 'var(--menu-gold-dark)' : 'var(--menu-text-muted)',
    fontSize: 12, fontWeight: 600 as const, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' as const,
    transition: 'all 0.2s ease',
  });

  const primaryBtn = {
    padding: '12px 24px', borderRadius: 100,
    background: 'var(--menu-charcoal)', color: '#fff',
    border: 'none', fontSize: 14, fontWeight: 600 as const, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' as const,
    transition: 'all 0.2s ease',
  };

  const outlineBtn = {
    padding: '10px 18px', borderRadius: 100,
    border: '1.5px solid var(--menu-card-border)',
    background: 'transparent', color: 'var(--menu-text-muted)',
    fontSize: 13, fontWeight: 500 as const, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' as const,
    transition: 'all 0.2s ease',
  };

  const greenBtn = {
    ...outlineBtn,
    borderColor: '#86efac',
    color: '#15803d',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)', marginBottom: 12,
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: 'var(--menu-bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--menu-card-border)',
        padding: '14px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/menu">
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--menu-charcoal)',
            }}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
          </Link>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Keranjang</h1>
            <p style={{ fontSize: 12, color: 'var(--menu-text-light)' }}>{count} item</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Cafe Info Card */}
        <div className="elegant-item-card" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--menu-warm)', color: 'var(--menu-gold)',
            }}>
              <Coffee style={{ width: 20, height: 20 }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{cafeInfo.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--menu-text-light)' }}>
                <MapPin style={{ width: 12, height: 12 }} />
                <span>Meja #{cafeInfo.tableNumber}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--menu-text-light)' }}>
              <Clock style={{ width: 12, height: 12 }} />
              <span>~15-20 menit</span>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--menu-warm)',
              }}>
                <Coffee style={{ width: 32, height: 32, color: 'var(--menu-text-light)' }} />
              </div>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Keranjang kosong</h3>
            <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>Tambahkan menu favorit Anda</p>
            <Link href="/menu">
              <button style={{ ...primaryBtn, marginTop: 16, background: 'var(--menu-gold)', color: '#fff' }}>
                Lihat Menu
              </button>
            </Link>
          </div>
        ) : (
          <>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map((item, idx) => (
                <div className="elegant-item-card" key={item.id + '-' + idx} style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 80, height: 80, flexShrink: 0, overflow: 'hidden', borderRadius: 10,
                    }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--menu-warm)' }}>
                          <Coffee style={{ width: 24, height: 24, color: 'var(--menu-text-light)', opacity: 0.5 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <div>
                          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{item.name}</h3>
                          {getCustomizationString(item) && (
                            <p style={{ fontSize: 12, color: 'var(--menu-text-light)', marginTop: 2 }}>{getCustomizationString(item)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.customization)}
                          style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--menu-text-light)', flexShrink: 0 }}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--menu-gold)' }}>{formatIDR(item.price * item.quantity)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1, item.customization)}
                            style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--menu-card-border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--menu-charcoal)' }}
                          >
                            <Minus style={{ width: 12, height: 12 }} />
                          </button>
                          <span style={{ width: 24, textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1, item.customization)}
                            style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--menu-card-border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--menu-charcoal)' }}
                          >
                            <Plus style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More + WA Order */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Link href="/menu" style={{ flex: 1 }}>
                <button style={outlineBtn}>
                  <Plus style={{ width: 16, height: 16 }} />
                  Tambah lagi
                </button>
              </Link>
              <button style={greenBtn} onClick={handleWhatsApp}>
                <MessageCircle style={{ width: 16, height: 16 }} />
                WA Order
              </button>
            </div>

            {/* Order Notes */}
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>Catatan Pesanan</label>
              <textarea
                placeholder="Ada permintaan khusus? (misal: tidak pedas, ekstra sambal, dll)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                style={{
                  width: '100%', minHeight: 72, padding: '12px 14px', borderRadius: 12,
                  border: '1.5px solid var(--menu-card-border)',
                  background: 'var(--menu-card)',
                  fontSize: 13, color: 'var(--menu-charcoal)',
                  resize: 'none', outline: 'none', fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Payment Method */}
            <div style={{ marginTop: 20 }}>
              <h3 style={sectionTitle}>Metode Pembayaran</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <button style={baseBtn(paymentMethod === 'QRIS')} onClick={() => setPaymentMethod('QRIS')}>
                  <QrCode style={{ width: 16, height: 16 }} />QRIS
                </button>
                <button style={baseBtn(paymentMethod === 'CASH')} onClick={() => setPaymentMethod('CASH')}>
                  <Banknote style={{ width: 16, height: 16 }} />Tunai
                </button>
                <button style={baseBtn(paymentMethod === 'WA_TRANSFER')} onClick={() => setPaymentMethod('WA_TRANSFER')}>
                  <MessageCircle style={{ width: 16, height: 16 }} />WA Transfer
                </button>
              </div>
              {paymentMethod === 'QRIS' && (
                <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: 'var(--menu-warm)', fontSize: 12, color: 'var(--menu-gold-dark)' }}>
                  Scan QRIS di kasir saat pembayaran
                </div>
              )}
              {paymentMethod === 'CASH' && (
                <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: '#f0fdf4', fontSize: 12, color: '#15803d' }}>
                  Bayar tunai di kasir setelah pesanan siap
                </div>
              )}
              {paymentMethod === 'WA_TRANSFER' && (
                <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 10, background: '#eff6ff', fontSize: 12, color: '#1d4ed8' }}>
                  Kami akan kirim nomor rekening via WhatsApp
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="elegant-item-card" style={{ marginTop: 16, padding: 16 }}>
              <h3 style={sectionTitle}>Ringkasan Pesanan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--menu-text-light)' }}>Subtotal</span>
                  <span style={{ color: 'var(--menu-charcoal)', fontWeight: 500 }}>{formatIDR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--menu-text-light)' }}>PPN (8%)</span>
                  <span style={{ color: 'var(--menu-charcoal)', fontWeight: 500 }}>{formatIDR(tax)}</span>
                </div>
                <div style={{ height: 1, background: 'var(--menu-card-border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: 'var(--menu-charcoal)' }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--menu-gold)' }}>{formatIDR(total)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Bar */}
      {cartItems.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--menu-card-border)',
          padding: '12px 16px',
        }}>
          <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleWhatsApp}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '1.5px solid #86efac',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#15803d', flexShrink: 0,
              }}
            >
              <MessageCircle style={{ width: 22, height: 22 }} />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--menu-text-light)' }}>Total</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--menu-gold)' }}>{formatIDR(total)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              style={{
                ...primaryBtn, flex: 1,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Memproses...
                </span>
              ) : 'Pesan Sekarang'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
