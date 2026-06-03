// src/services/ordersService.ts
import apiClient from '@/lib/apiClient';

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
}

export interface OrderItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderFilters {
  status?: string;
  orderType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

class OrdersService {
  async getOrders(filters?: OrderFilters): Promise<{ data: Order[]; pagination: any }> {
    try {
      console.log('[FE OrdersService] Getting orders with filters:', filters);
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.orderType) params.append('orderType', filters.orderType);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/orders?${queryString}` : '/orders';
      
      console.log('[FE OrdersService] Calling API:', url);
      const response = await apiClient.get<{ data: Order[]; pagination: any }>(url);
      console.log('[FE OrdersService] API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE OrdersService] Error getting orders:', error);
      throw this.handleError(error);
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrder(orderData: any): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/orders', orderData);
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

export const ordersService = new OrdersService();