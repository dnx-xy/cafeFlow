'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { ordersService } from '@/services/ordersService';
import { customersService } from '@/services/customersService';

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  businessId: string;
}

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT: 'TENANT',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF'
};

// Mock tenant data to show how data would be isolated
export const MOCK_TENANT_DATA = {
  'tenant-A': {
    name: 'The Daily Grind',
    customers: 1247,
    orders: 2450,
    revenue: 48900
  },
  'tenant-B': {
    name: 'Café Luna',
    customers: 820,
    orders: 1820,
    revenue: 36400
  },
  'tenant-C': {
    name: 'Brew & Beyond',
    customers: 560,
    orders: 890,
    revenue: 17800
  }
};

export interface Order {
  id: string;
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  orderType: 'DINING_IN' | 'TAKEAWAY' | 'DELIVERY';
  tableNumber?: string;
  totalAmount: number;
  items?: OrderItem[];
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  customer?: string;
  email?: string;
}

export interface OrderItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  joinDate: string;
  totalSpent: number;
  visitCount: number;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

// Auth context
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to authenticate user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Don't redirect immediately, let the component handle it
      // The AuthGuard should handle the redirect
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Set user data
      setUser(response.user);
      setError(null);
      
      // Redirect to dashboard
      router.push('/dashboard');
      toast.success('Login successful!');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error('Login failed', {
        description: errorMessage || 'Invalid email or password'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, businessName: string) => {
    try {
      setLoading(true);
      const response = await authService.register({ name, email, password, businessName });
      
      // Automatically log in after registration
      const loginResponse = await authService.login({ email, password });
      localStorage.setItem('access_token', loginResponse.access_token);
      localStorage.setItem('refresh_token', loginResponse.refresh_token);
      
      setUser(loginResponse.user);
      setError(null);
      router.push('/dashboard');
      toast.success('Registration successful!');
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      toast.error('Registration failed', {
        description: errorMessage || 'Please try again'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails, clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      router.push('/');
    }
  };

  // Reset auth state manually
  const resetAuthState = () => {
    setUser(null);
    setError(null);
  };

  const switchTenant = async (tenantId: string) => {
    try {
      setLoading(true);
      const response = await authService.switchTenant(tenantId);
      
      // Store new tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Update user data
      setUser(response.user);
      setError(null);
      
      // Return the response for any additional processing if needed
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch tenant';
      setError(errorMessage);
      toast.error('Tenant switch failed', {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Force refresh auth state (to be called after tenant switch)
  const refreshAuthState = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to refresh auth state:', err);
      // Clear tokens if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchUserData,
    switchTenant,
    resetAuthState
  };
};

// Orders context
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = async (filters?: any) => {
    try {
      setLoading(true);
      console.log('[FE useOrders] Fetching orders with filters:', filters);
      const result = await ordersService.getOrders(filters);
      console.log('[FE useOrders] Orders fetched:', result.data?.length, 'orders');
      setOrders(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      console.error('[FE useOrders] Orders fetch error:', err);
      setError(errorMessage);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id: string) => {
    try {
      setLoading(true);
      const order = await ordersService.getOrderById(id);
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      toast.error('Failed to load order');
      console.error('Order fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const updatedOrder = await ordersService.updateOrderStatus(id, status);
      // Update local state
      setOrders(orders.map(order => order.id === id ? updatedOrder : order));
      toast.success('Order status updated');
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      setError(errorMessage);
      toast.error('Failed to update order');
      console.error('Order update error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus
  };
};

// Customers context
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchCustomers = async (filters?: any) => {
    try {
      setLoading(true);
      console.log('[FE useCustomers] Fetching customers with filters:', filters);
      const result = await customersService.getCustomers(filters);
      console.log('[FE useCustomers] Customers fetched:', result.data?.length, 'customers');
      setCustomers(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers';
      console.error('[FE useCustomers] Customers fetch error:', err);
      setError(errorMessage);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerById = async (id: string) => {
    try {
      setLoading(true);
      const customer = await customersService.getCustomerById(id);
      return customer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer';
      setError(errorMessage);
      toast.error('Failed to load customer');
      console.error('Customer fetch error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    pagination,
    fetchCustomers,
    fetchCustomerById
  };
};