'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface Review {
  id: string;
  customerId: string;
  orderId?: string;
  rating: number;
  comment?: string;
  tenantId: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', customerId: 'c1', rating: 5, comment: 'Amazing coffee! The caramel macchiato is the best I have ever had.', tenantId: 't1', customer: { id: 'c1', name: 'Sarah Johnson', email: 'sarah@example.com' }, createdAt: '2026-06-03T10:30:00Z', updatedAt: '2026-06-03T10:30:00Z' },
  { id: '2', customerId: 'c2', rating: 4, comment: 'Great atmosphere and friendly staff. The avocado toast was delicious.', tenantId: 't1', customer: { id: 'c2', name: 'Mike Chen', email: 'mike@example.com' }, createdAt: '2026-06-03T09:15:00Z', updatedAt: '2026-06-03T09:15:00Z' },
  { id: '3', customerId: 'c3', rating: 3, comment: 'Coffee was good but service was a bit slow during peak hours.', tenantId: 't1', customer: { id: 'c3', name: 'Emily Davis', email: 'emily@example.com' }, createdAt: '2026-06-02T14:00:00Z', updatedAt: '2026-06-02T14:00:00Z' },
  { id: '4', customerId: 'c4', rating: 5, comment: 'Love the cold brew! Best in town. Will definitely come back.', tenantId: 't1', customer: { id: 'c4', name: 'James Wilson', email: 'james@example.com' }, createdAt: '2026-06-02T11:45:00Z', updatedAt: '2026-06-02T11:45:00Z' },
  { id: '5', customerId: 'c5', rating: 2, comment: 'Order was wrong and took too long. Disappointed.', tenantId: 't1', customer: { id: 'c5', name: 'Lisa Brown', email: 'lisa@example.com' }, createdAt: '2026-06-01T18:20:00Z', updatedAt: '2026-06-01T18:20:00Z' },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/customers/feedback');
      setReviews(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch {
      setReviews(MOCK_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, fetchReviews };
}
