// src/services/apiService.ts
import apiClient from '@/lib/apiClient';

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    // In a real app, you'd call the logout endpoint here
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/customers/me');
    return response.data;
  }
};

// Orders Service
export const ordersService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData: any) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  update: async (id: string, orderData: any) => {
    const response = await apiClient.put(`/orders/${id}`, orderData);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  }
};

// Customers Service
export const customersService = {
  getAll: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/customers/me');
    return response.data;
  },

  updateProfile: async (customerData: any) => {
    const response = await apiClient.put('/customers/me', customerData);
    return response.data;
  },

  create: async (customerData: any) => {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  },

  update: async (id: string, customerData: any) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  }
};
