'use client';

import { useState } from 'react';

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

const MOCK_ANALYTICS: AnalyticsData = {
  revenue: { total: 45820, change: 12.5 },
  orders: { total: 1247, change: 8.3 },
  customers: { total: 892, change: 5.1 },
  avgOrderValue: { value: 19.72, change: -2.1 },
  conversionRate: { value: 68.4, change: 3.2 },
  revenueChart: [
    { date: 'Mon', revenue: 5200, orders: 42, customers: 35 },
    { date: 'Tue', revenue: 4800, orders: 38, customers: 30 },
    { date: 'Wed', revenue: 6200, orders: 48, customers: 42 },
    { date: 'Thu', revenue: 5900, orders: 45, customers: 38 },
    { date: 'Fri', revenue: 7800, orders: 56, customers: 48 },
    { date: 'Sat', revenue: 9200, orders: 68, customers: 55 },
    { date: 'Sun', revenue: 6720, orders: 52, customers: 44 },
  ],
  topItems: [
    { name: 'Caramel Macchiato', sales: 142, revenue: 1988, trend: 'up' },
    { name: 'Avocado Toast', sales: 98, revenue: 1372, trend: 'up' },
    { name: 'Cold Brew', sales: 87, revenue: 1087, trend: 'down' },
    { name: 'Eggs Benedict', sales: 76, revenue: 1368, trend: 'up' },
    { name: 'Matcha Latte', sales: 65, revenue: 910, trend: 'up' },
  ],
  peakHours: [
    { hour: '07:00', orders: 8 },
    { hour: '08:00', orders: 24 },
    { hour: '09:00', orders: 32 },
    { hour: '10:00', orders: 18 },
    { hour: '11:00', orders: 12 },
    { hour: '12:00', orders: 28 },
    { hour: '13:00', orders: 22 },
    { hour: '14:00', orders: 15 },
    { hour: '15:00', orders: 10 },
    { hour: '16:00', orders: 14 },
    { hour: '17:00', orders: 20 },
    { hour: '18:00', orders: 16 },
  ],
  customerRetention: {
    newCustomers: 245,
    returningCustomers: 647,
    rate: 72.5,
  },
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(MOCK_ANALYTICS);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAnalytics };
}
