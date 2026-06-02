'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: Record<string, string>;
}

const CART_KEY = 'cafe_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useMenuCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i =>
        i.id === item.id && JSON.stringify(i.customization) === JSON.stringify(item.customization)
      );
      if (existing) {
        return prev.map(i =>
          i.id === item.id && JSON.stringify(i.customization) === JSON.stringify(item.customization)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number, customization?: Record<string, string>) => {
    setItems(prev =>
      prev
        .map(i =>
          i.id === id && JSON.stringify(i.customization) === JSON.stringify(customization)
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string, customization?: Record<string, string>) => {
    setItems(prev =>
      prev.filter(i =>
        !(i.id === id && JSON.stringify(i.customization) === JSON.stringify(customization))
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, count, subtotal, loaded, addItem, updateQuantity, removeItem, clearCart };
}
