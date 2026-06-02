'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  pointsPerRupiah: number;
  minimumPurchase: number;
  maximumPointsPerOrder?: number;
  isActive: boolean;
  businessId: string;
  tenantId: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description?: string;
  pointsRequired: number;
  rewardType: 'DISCOUNT' | 'FREE_ITEM' | 'VOUCHER' | 'EXCLUSIVE_ACCESS';
  discountValue?: number;
  freeItemMenuId?: string;
  isActive: boolean;
  loyaltyProgramId: string;
}

export interface PointTransaction {
  id: string;
  customerId: string;
  points: number;
  transactionType: 'EARNED' | 'SPENT';
  description: string;
  createdAt: string;
}

const MOCK_PROGRAM: LoyaltyProgram = {
  id: 'prog-1',
  name: 'Cafe Rewards',
  description: 'Earn points with every purchase and redeem for rewards',
  pointsPerRupiah: 1,
  minimumPurchase: 10000,
  maximumPointsPerOrder: 1000,
  isActive: true,
  businessId: 'b1',
  tenantId: 't1',
};

const MOCK_REWARDS: LoyaltyReward[] = [
  { id: 'r1', name: 'Free Coffee', description: 'Redeem for any regular coffee', pointsRequired: 100, rewardType: 'FREE_ITEM', isActive: true, loyaltyProgramId: 'prog-1' },
  { id: 'r2', name: '$5 Discount', description: 'Get $5 off your next purchase', pointsRequired: 250, rewardType: 'DISCOUNT', discountValue: 5, isActive: true, loyaltyProgramId: 'prog-1' },
  { id: 'r3', name: 'Birthday Voucher', description: 'Special birthday treat voucher', pointsRequired: 500, rewardType: 'VOUCHER', discountValue: 10, isActive: true, loyaltyProgramId: 'prog-1' },
];

export function useLoyalty() {
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/loyalty/programs');
      setProgram(res.data);
    } catch {
      setProgram(MOCK_PROGRAM);
    } finally {
      setLoading(false);
    }
  };

  const updateProgram = async (id: string, data: Partial<LoyaltyProgram>) => {
    try {
      const res = await apiClient.put(`/loyalty/programs/${id}`, data);
      setProgram(res.data);
      return res.data;
    } catch {
      setProgram(prev => prev ? { ...prev, ...data } : prev);
      return { ...program, ...data };
    }
  };

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/loyalty/rewards');
      setRewards(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch {
      setRewards(MOCK_REWARDS);
    } finally {
      setLoading(false);
    }
  };

  return { program, rewards, loading, error, fetchProgram, updateProgram, fetchRewards };
}
