'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export function usePublicOrder() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (data: {
    tableId: string;
    items: { menuItemId: string; quantity: number; notes?: string; options?: { optionValueId: string; priceAdjustment?: number }[] }[];
    notes?: string;
    orderType?: string;
    customerName?: string;
    customerWhatsapp?: string;
    paymentMethod?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/public/orders', data);
      setOrder(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error, submitOrder };
}
