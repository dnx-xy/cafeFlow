'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export function usePublicFeedback() {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (data: {
    customerName?: string;
    customerWhatsapp?: string;
    rating: number;
    comment?: string;
    orderId?: string;
    tenantId: string;
    businessId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/public/feedback', data);
      setFeedback(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { feedback, loading, error, submitFeedback };
}
