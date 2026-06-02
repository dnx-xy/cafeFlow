'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface CafeInfo {
  id: string;
  name: string;
  description?: string;
  location?: string;
  hours?: string;
  tableNumber: string;
  logo?: string;
  outletId: string;
  tenantId: string;
  businessId: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  soldOut: boolean;
  hidden?: boolean;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  menuCategoryId?: string;
}

export interface MenuCategoryData {
  id: string;
  name: string;
  description?: string;
  sortIndex?: number;
  isActive?: boolean;
  menuItems?: MenuItemData[];
}

export interface MenuData {
  id: string;
  name: string;
  description?: string;
  categories?: MenuCategoryData[];
  cafe?: CafeInfo;
}

export function usePublicMenu() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [cafe, setCafe] = useState<CafeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuByTable = async (tableId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/public/tables/${tableId}/menu`);
      setMenu(res.data.menu);
      setCafe(res.data.cafe);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { menu, cafe, loading, error, fetchMenuByTable };
}
