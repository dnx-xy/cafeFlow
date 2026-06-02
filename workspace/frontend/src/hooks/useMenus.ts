'use client';

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export interface Menu {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  outletId: string;
  tenantId: string;
  businessId: string;
  categories?: MenuCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  sortIndex?: number;
  isActive: boolean;
  menuId: string;
  menuItems?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  soldOut: boolean;
  hidden: boolean;
  stockQuantity?: number;
  menuCategoryId?: string;
  menuId: string;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  categorySortIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export function useMenus() {
  const [menus, setMenus] = useState<Menu[] | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/menus');
      const data = response.data;
      setMenus(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuWithItems = async (menuId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/menus/${menuId}/items?include=categories,items`);
      setSelectedMenu(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createMenu = async (data: Partial<Menu>) => {
    const res = await apiClient.post('/menus', data);
    setMenus(prev => prev ? [...prev, res.data] : [res.data]);
    return res.data;
  };

  const updateMenu = async (id: string, data: Partial<Menu>) => {
    const res = await apiClient.put(`/menus/${id}`, data);
    setMenus(prev => prev?.map(m => m.id === id ? res.data : m) ?? null);
    setSelectedMenu(prev => prev?.id === id ? { ...prev, ...res.data } : prev);
    return res.data;
  };

  const deleteMenu = async (id: string) => {
    await apiClient.delete(`/menus/${id}`);
    setMenus(prev => prev?.filter(m => m.id !== id) ?? null);
    if (selectedMenu?.id === id) setSelectedMenu(null);
  };

  const createCategory = async (menuId: string, data: Partial<MenuCategory>) => {
    const res = await apiClient.post(`/menus/${menuId}/categories`, data);
    setSelectedMenu(prev => prev ? {
      ...prev,
      categories: [...(prev.categories ?? []), res.data],
    } : prev);
    return res.data;
  };

  const updateCategory = async (id: string, data: Partial<MenuCategory>) => {
    const res = await apiClient.put(`/menus/categories/${id}`, data);
    setSelectedMenu(prev => prev ? {
      ...prev,
      categories: prev.categories?.map(c => c.id === id ? res.data : c) ?? [],
    } : prev);
    return res.data;
  };

  const deleteCategory = async (id: string) => {
    await apiClient.delete(`/menus/categories/${id}`);
    setSelectedMenu(prev => prev ? {
      ...prev,
      categories: prev.categories?.filter(c => c.id !== id) ?? [],
    } : prev);
  };

  const createItem = async (menuId: string, data: Partial<MenuItem>) => {
    const res = await apiClient.post(`/menus/${menuId}/items`, data);
    setSelectedMenu(prev => {
      if (!prev) return prev;
      const categories = prev.categories?.map(c => {
        if (data.menuCategoryId && c.id === data.menuCategoryId) {
          return { ...c, menuItems: [...(c.menuItems ?? []), res.data] };
        }
        return c;
      }) ?? [];
      return { ...prev, categories };
    });
    return res.data;
  };

  const updateItem = async (id: string, data: Partial<MenuItem>) => {
    const res = await apiClient.put(`/menus/items/${id}`, data);
    setSelectedMenu(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories?.map(c => ({
          ...c,
          menuItems: c.menuItems?.map(i => i.id === id ? res.data : i) ?? [],
        })) ?? [],
      };
    });
    return res.data;
  };

  const deleteItem = async (id: string) => {
    await apiClient.delete(`/menus/items/${id}`);
    setSelectedMenu(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories?.map(c => ({
          ...c,
          menuItems: c.menuItems?.filter(i => i.id !== id) ?? [],
        })) ?? [],
      };
    });
  };

  return {
    menus,
    selectedMenu,
    loading,
    error,
    fetchMenus,
    fetchMenuWithItems,
    createMenu,
    updateMenu,
    deleteMenu,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
    setSelectedMenu,
  };
}
