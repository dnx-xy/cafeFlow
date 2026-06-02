"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Plus, Minus, Heart, Share2, Star,
  Coffee, Leaf, ShoppingCart, Loader2, Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-red-500">{error || 'Item tidak ditemukan'}</p>
        <Link href={menuUrl}>
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Kembali ke Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="relative">
        <div className="h-72 w-full overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
              <Coffee className="h-20 w-20 text-amber-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link href={menuUrl}>
            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/menu/cart" className="relative">
              <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={isFavorite ? "h-5 w-5 fill-red-500 text-red-500" : "h-5 w-5"} />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {item.isFeatured && (
            <Badge className="bg-amber-500 text-white border-0"><Star className="mr-1 h-3 w-3 fill-white" />Terlaris</Badge>
          )}
          {item.isSpecialOffer && (
            <Badge className="bg-green-500 text-white border-0"><Leaf className="mr-1 h-3 w-3" />Promo</Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold">{item.name}</h1>
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>

        {item.soldOut && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            Maaf, item ini sedang habis
          </div>
        )}

        {item.popularityScore > 50 && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            Menu favorit pelanggan! {item.popularityScore} orang telah memesan
          </div>
        )}

        {/* Menu Options */}
        {item.menuOptions && item.menuOptions.length > 0 && (
          <div className="mb-6 space-y-4">
            {item.menuOptions.map((option) => (
              <div key={option.id}>
                <div className="mb-2 flex items-center gap-1">
                  <h3 className="text-sm font-semibold">{option.name}</h3>
                  {option.required && (
                    <span className="text-xs text-red-500">*Wajib</span>
                  )}
                </div>
                {option.description && (
                  <p className="mb-2 text-xs text-muted-foreground">{option.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {option.options.filter(v => v.available).map((value) => {
                    const isSelected = selectedOptions[option.id] === value.id;
                    return (
                      <button
                        key={value.id}
                        onClick={() => handleSelectOption(option.id, value.id)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-amber-200 hover:text-amber-600'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {value.name}
                        {value.priceAdjustment ? (
                          <span className="text-[10px] opacity-70">(+{formatIDR(value.priceAdjustment)})</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted p-3 text-center">
            <p className="text-lg font-bold text-amber-600">{formatIDR(unitPrice)}</p>
            <p className="text-xs text-muted-foreground">Harga</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/50" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={item.soldOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/50" onClick={() => setQuantity(quantity + 1)} disabled={item.soldOut}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600" onClick={handleAddToCart} disabled={item.soldOut}>
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-80">Tambah ke Keranjang</span>
              <span className="text-base font-bold">{formatIDR(totalPrice)}</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
