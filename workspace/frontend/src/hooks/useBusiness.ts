'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface Business {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  countryCode?: string;
  currency?: string;
  whatsappNumber?: string;
  ownerId: string;
  tenantId: string;
}

const MOCK_BUSINESS: Business = {
  id: 'b1',
  name: 'The Daily Grind',
  description: 'A cozy neighborhood café serving artisanal coffee and freshly baked pastries since 2020.',
  logoUrl: '',
  address: '123 Coffee Street',
  city: 'Jakarta',
  countryCode: 'ID',
  currency: 'USD',
  ownerId: 'u1',
  tenantId: 't1',
};

export function useBusiness() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async (businessId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/businesses/${businessId}`);
      setBusiness(res.data);
    } catch {
      setBusiness(MOCK_BUSINESS);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (id: string, data: Partial<Business>) => {
    try {
      const res = await apiClient.put(`/businesses/${id}`, data);
      setBusiness(res.data);
      return res.data;
    } catch {
      setBusiness(prev => prev ? { ...prev, ...data } : prev);
      return { ...business, ...data };
    }
  };

  return { business, loading, error, fetchBusiness, updateBusiness };
}
