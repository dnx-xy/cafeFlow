"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Clock, MapPin, Coffee,
  Share2, Home, Star, QrCode, Banknote, MessageCircle,
} from "lucide-react";
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
      case 'CASH': return <Banknote style={{ width: 16, height: 16 }} />;
      case 'WA_TRANSFER': return <MessageCircle style={{ width: 16, height: 16 }} />;
      default: return <QrCode style={{ width: 16, height: 16 }} />;
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
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--menu-bg)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--menu-card-border)', borderTopColor: 'var(--menu-gold)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)', marginBottom: 16,
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--menu-card)', borderRadius: 16,
    border: '1px solid var(--menu-card-border)', padding: 16,
    marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const infoIcon = (bg: string, color: string) => ({
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg, color, flexShrink: 0,
  });

  const primaryBtn: React.CSSProperties = {
    padding: '12px 20px', borderRadius: 100,
    background: 'var(--menu-charcoal)', color: '#fff',
    border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    transition: 'all 0.2s ease', width: '100%',
  };

  const outlineBtn: React.CSSProperties = {
    padding: '12px 20px', borderRadius: 100,
    border: '1.5px solid var(--menu-card-border)',
    background: 'transparent', color: 'var(--menu-text-muted)',
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
    transition: 'all 0.2s ease', width: '100%',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--menu-bg)' }}>
      {/* Success Header */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '48px 16px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          margin: '0 auto 16px', width: 72, height: 72, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(45,42,39,0.06)',
        }}>
          <CheckCircle2 style={{ width: 36, height: 36, color: 'var(--menu-gold)' }} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--menu-charcoal)' }}>
          Pesanan Dikonfirmasi!
        </h1>
        <p style={{ fontSize: 13, color: 'var(--menu-text-muted)', marginTop: 4 }}>
          Pesanan Anda telah diterima dan sedang disiapkan
        </p>
      </div>

      <div style={{ padding: '0 16px 96px' }}>
        {/* Order Info */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--menu-text-light)' }}>Nomor Pesanan</p>
              <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: 'var(--menu-charcoal)' }}>{orderDetails?.orderId || '------'}</p>
            </div>
            <button onClick={handleShare} style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--menu-card-border)',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--menu-text-light)',
            }}>
              <Share2 style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--menu-card-border)', display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={infoIcon('var(--menu-warm)', 'var(--menu-gold-dark)')}>
                <Clock style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--menu-text-light)' }}>Estimasi</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{orderDetails?.estimatedTime || '15-20 menit'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={infoIcon('var(--menu-warm)', 'var(--menu-gold-dark)')}>
                <MapPin style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--menu-text-light)' }}>Meja</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>#{orderDetails?.tableNumber || 'N/A'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={infoIcon('var(--menu-warm)', 'var(--menu-gold-dark)')}>
                {paymentIcon(orderDetails?.paymentMethod)}
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--menu-text-light)' }}>Pembayaran</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{paymentLabel(orderDetails?.paymentMethod)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Status Pesanan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: CheckCircle2, label: 'Pesanan Dikonfirmasi', desc: 'Pesanan Anda telah diterima', done: true },
              { icon: Coffee, label: 'Sedang Disiapkan', desc: 'Koki kami sedang memasak', done: false },
              { icon: Coffee, label: 'Siap Disajikan', desc: 'Kami akan memberitahu jika siap', done: false },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 32, left: 11, width: 2, height: 28,
                    background: step.done ? 'var(--menu-gold)' : 'var(--menu-card-border)',
                  }} />
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step.done ? 'var(--menu-gold)' : 'var(--menu-card-border)',
                  color: step.done ? '#fff' : 'var(--menu-text-light)',
                }}>
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: step.done ? 'var(--menu-charcoal)' : 'var(--menu-text-light)' }}>{step.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--menu-text-light)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QRIS / Cash Info */}
        {orderDetails?.paymentMethod === 'QRIS' && (
          <div style={{
            ...cardStyle,
            background: 'var(--menu-warm)',
            border: '1px solid rgba(201,169,110,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--menu-gold)', color: '#fff',
              }}>
                <QrCode style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-gold-dark)' }}>Bayar dengan QRIS</p>
                <p style={{ fontSize: 12, color: 'var(--menu-text-muted)' }}>Scan QRIS di kasir untuk menyelesaikan pembayaran</p>
              </div>
            </div>
          </div>
        )}

        {orderDetails?.paymentMethod === 'CASH' && (
          <div style={{
            ...cardStyle,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#22c55e', color: '#fff',
              }}>
                <Banknote style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>Bayar Tunai</p>
                <p style={{ fontSize: 12, color: '#4ade80' }}>Siapkan {formatIDR(orderDetails?.finalAmount || orderDetails?.totalAmount || 0)} untuk dibayarkan di kasir</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Ringkasan Pesanan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(orderDetails?.items || []).map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--menu-text-light)' }}>{item.quantity}x</span>
                  <span style={{ color: 'var(--menu-charcoal)' }}>{item.itemName || item.name || 'Menu'}</span>
                </div>
                <span style={{ color: 'var(--menu-text-light)' }}>{formatIDR(item.totalPrice || item.price || 0)}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--menu-card-border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, color: 'var(--menu-charcoal)' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--menu-gold)' }}>{formatIDR(orderDetails?.finalAmount || orderDetails?.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{
          padding: '12px 16px', borderRadius: 12,
          background: 'var(--menu-warm)', textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, color: 'var(--menu-text-muted)' }}>Kami akan memberitahu Anda saat pesanan siap</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--menu-card-border)',
        padding: '12px 16px',
      }}>
        <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', gap: 12 }}>
          <Link href="/menu" style={{ flex: 1 }}>
            <button style={outlineBtn}>
              <Home style={{ width: 16, height: 16 }} />
              Kembali ke Menu
            </button>
          </Link>
          <Link href="/menu/review" style={{ flex: 1 }}>
            <button style={{ ...primaryBtn }}>
              <Star style={{ width: 16, height: 16 }} />
              Beri Penilaian
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
