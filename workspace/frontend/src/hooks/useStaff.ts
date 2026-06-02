'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface StaffMember {
  id: string;
  userId: string;
  outletId: string;
  roleId: 'ADMIN' | 'MANAGER' | 'WAITER' | 'CHEF' | 'CASHIER';
  isActive: boolean;
  tenantId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  outlet?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export function useStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/staff');
      setStaff(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (data: Partial<StaffMember>) => {
    const res = await apiClient.post('/staff', data);
    setStaff(prev => [...prev, res.data]);
    return res.data;
  };

  const updateStaff = async (id: string, data: Partial<StaffMember>) => {
    const res = await apiClient.put(`/staff/${id}`, data);
    setStaff(prev => prev.map(s => s.id === id ? res.data : s));
    return res.data;
  };

  const deleteStaff = async (id: string) => {
    await apiClient.delete(`/staff/${id}`);
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return { staff, loading, error, fetchStaff, createStaff, updateStaff, deleteStaff };
}
