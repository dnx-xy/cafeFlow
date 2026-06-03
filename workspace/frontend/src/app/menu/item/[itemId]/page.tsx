"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Plus, Minus, Heart, Star,
  Coffee, ShoppingCart, Loader2, Check,
} from "lucide-react";
import { toast } from "sonner";
import { useMenuCart } from "@/hooks/useMenuCart";
import { formatIDR } from "@/lib/format-idr";
import apiClient from "@/lib/apiClient";

interface MenuOptionValue {
  id: string;
  name: string;
  priceAdjustment?: number;
  available: boolean;
}

interface MenuOption {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  options: MenuOptionValue[];
}

interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  soldOut: boolean;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  popularityScore?: number;
  menuOptions?: MenuOption[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const tableId = typeof window !== 'undefined' ? localStorage.getItem('cafe_table_id') : null;
  const menuUrl = tableId ? `/menu/${tableId}` : '/menu';
  const [item, setItem] = useState<MenuItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem, count: cartCount } = useMenuCart();

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    apiClient.get(`/public/menu-items/${itemId}`)
      .then(res => setItem(res.data))
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false));
  }, [itemId]);

  const optionAdjustment = item?.menuOptions?.reduce((sum, opt) => {
    const selected = opt.options.find(v => v.id === selectedOptions[opt.id]);
    return sum + (selected?.priceAdjustment ?? 0);
  }, 0) ?? 0;

  const unitPrice = item ? item.price + optionAdjustment : 0;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionId]: valueId }));
  };

  const handleAddToCart = () => {
    if (!item) return;

    const missingRequired = item.menuOptions?.filter(o => o.required && !selectedOptions[o.id]) || [];
    if (missingRequired.length > 0) {
      toast.error(`Pilih ${missingRequired.map(o => o.name).join(', ')} terlebih dahulu`);
      return;
    }

    const customization: Record<string, string> = {};
    if (item.menuOptions?.length) {
      for (const opt of item.menuOptions) {
        const val = opt.options.find(v => v.id === selectedOptions[opt.id]);
        if (val) customization[opt.name] = val.name;
      }
    }

    addItem({
      id: item.id,
      name: item.name,
      price: unitPrice,
      image: item.imageUrl || '',
      quantity,
      customization: Object.keys(customization).length > 0 ? customization : undefined,
    });
    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      description: `${quantity} x ${formatIDR(unitPrice)}`,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--menu-bg)' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--menu-gold)' }} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4" style={{ background: 'var(--menu-bg)' }}>
        <Coffee style={{ width: 40, height: 40, color: 'var(--menu-text-light)', opacity: 0.4 }} />
        <p style={{ fontSize: 14, color: 'var(--menu-text-muted)' }}>{error || 'Item tidak ditemukan'}</p>
        <Link href={menuUrl}>
          <button style={{
            padding: '10px 24px', borderRadius: 100, background: 'var(--menu-charcoal)',
            color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Kembali ke Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: 'var(--menu-bg)' }}>
      {/* Hero Image */}
      <div className="elegant-header" style={{ minHeight: 280 }}>
        <div className="elegant-header-bg">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--menu-warm) 0%, var(--menu-warm-hover) 100%)' }} />
          )}
          <div className="elegant-header-overlay" />
        </div>

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Link href={menuUrl}>
            <button className="elegant-cart-fab" style={{ position: 'static' }}>
              <ArrowLeft />
            </button>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/menu/cart">
              <button className="elegant-cart-fab" style={{ position: 'static' }}>
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="elegant-cart-badge">{cartCount}</span>
                )}
              </button>
            </Link>
            <button
              className="elegant-cart-fab" style={{ position: 'static' }}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart style={isFavorite ? { fill: '#ef4444', color: '#ef4444' } : {}} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 3, display: 'flex', gap: 8 }}>
          {item.isFeatured && (
            <span className="elegant-badge featured" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '4px 12px', fontSize: 11 }}>
              <Star style={{ width: 12, height: 12, marginRight: 4 }} />
              Terlaris
            </span>
          )}
          {item.isSpecialOffer && (
            <span className="elegant-badge promo" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 12px', fontSize: 11 }}>
              Promo
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="elegant-cafe-name" style={{ fontSize: 22, marginBottom: 8 }}>{item.name}</h1>
          {item.description && (
            <p style={{ fontSize: 14, color: 'var(--menu-text-muted)', lineHeight: 1.6 }}>{item.description}</p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span className="elegant-item-price" style={{ fontSize: 24 }}>{formatIDR(unitPrice)}</span>
          {item.popularityScore > 50 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              borderRadius: 6, background: 'var(--menu-warm)', fontSize: 11, color: 'var(--menu-gold-dark)',
            }}>
              <Star style={{ width: 12, height: 12, fill: 'var(--menu-gold)', color: 'var(--menu-gold)' }} />
              {item.popularityScore} terjual
            </span>
          )}
        </div>

        {item.soldOut && (
          <div style={{
            padding: '12px 16px', borderRadius: 12, background: 'rgba(45,42,39,0.06)',
            fontSize: 13, color: 'var(--menu-text-muted)', marginBottom: 20, textAlign: 'center',
          }}>
            Maaf, item ini sedang habis
          </div>
        )}

        {/* Menu Options */}
        {item.menuOptions && item.menuOptions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {item.menuOptions.map((option) => (
              <div key={option.id} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{option.name}</h3>
                  {option.required && (
                    <span style={{ fontSize: 11, color: 'var(--menu-text-muted)' }}>*Wajib</span>
                  )}
                </div>
                {option.description && (
                  <p style={{ fontSize: 12, color: 'var(--menu-text-light)', marginBottom: 8 }}>{option.description}</p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {option.options.filter(v => v.available).map((value) => {
                    const isSelected = selectedOptions[option.id] === value.id;
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleSelectOption(option.id, value.id)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '8px 16px', borderRadius: 100,
                          border: `1.5px solid ${isSelected ? 'var(--menu-gold)' : 'var(--menu-card-border)'}`,
                          background: isSelected ? 'var(--menu-warm)' : 'var(--menu-card)',
                          color: isSelected ? 'var(--menu-gold-dark)' : 'var(--menu-text-muted)',
                          fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isSelected && <Check style={{ width: 14, height: 14 }} />}
                        {value.name}
                        {value.priceAdjustment ? (
                          <span style={{ fontSize: 11, opacity: 0.7 }}>(+{formatIDR(value.priceAdjustment)})</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--menu-card-border)',
        padding: '12px 20px',
      }}>
        <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={item.soldOut}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1.5px solid var(--menu-card-border)',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--menu-charcoal)',
              }}
            >
              <Minus style={{ width: 16, height: 16 }} />
            </button>
            <span style={{ width: 32, textAlign: 'center', fontSize: 18, fontWeight: 600, color: 'var(--menu-charcoal)' }}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={item.soldOut}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '1.5px solid var(--menu-card-border)',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--menu-charcoal)',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={item.soldOut}
            style={{
              flex: 1, padding: '12px 24px', borderRadius: 100,
              background: item.soldOut ? 'var(--menu-text-light)' : 'var(--menu-charcoal)',
              color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
              cursor: item.soldOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 11, opacity: 0.7 }}>Tambah ke Keranjang</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{formatIDR(totalPrice)}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
