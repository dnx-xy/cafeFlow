'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export function usePublicLoyalty() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinLoyalty = async (data: {
    name: string;
    whatsappNumber: string;
    tenantId: string;
    businessId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/public/loyalty/join', data);
      setCustomer(res.data.customer);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join loyalty program');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { customer, loading, error, joinLoyalty };
}
