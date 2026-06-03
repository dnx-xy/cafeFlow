// src/services/customersService.ts
import apiClient from '@/lib/apiClient';

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

export interface CustomerFilters {
  page?: number;
  limit?: number;
}

class CustomersService {
  async getCustomers(filters?: CustomerFilters): Promise<{ data: Customer[]; pagination: any }> {
    try {
      console.log('[FE CustomersService] Getting customers with filters:', filters);
      const params = new URLSearchParams();
      
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/customers?${queryString}` : '/customers';
      
      console.log('[FE CustomersService] Calling API:', url);
      const response = await apiClient.get<{ data: Customer[]; pagination: any }>(url);
      console.log('[FE CustomersService] API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE CustomersService] Error getting customers:', error);
      throw this.handleError(error);
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await apiClient.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    try {
      const response = await apiClient.put<Customer>(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const response = await apiClient.post<Customer>('/customers', customerData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      return new Error(data.message || `HTTP Error: ${status}`);
    } else if (error.request) {
      return new Error('Network Error: Unable to connect to server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const customersService = new CustomersService();