'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';

export interface AnalyticsData {
  revenue: { total: number; change: number };
  orders: { total: number; change: number };
  customers: { total: number; change: number };
  avgOrderValue: { value: number; change: number };
  conversionRate: { value: number; change: number };
  revenueChart: { date: string; revenue: number; orders: number; customers: number }[];
  topItems: { name: string; sales: number; revenue: number; trend: 'up' | 'down' }[];
  peakHours: { hour: string; orders: number }[];
  customerRetention: { newCustomers: number; returningCustomers: number; rate: number };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (period: 'week' | 'month' | 'year' = 'week') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/analytics?period=${period}`);
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalytics };
}