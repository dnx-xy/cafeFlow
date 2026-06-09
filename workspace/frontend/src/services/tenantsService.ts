// src/services/tenantsService.ts
import apiClient from '@/lib/apiClient';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantDetails extends Tenant {
  email?: string;
  phone?: string;
  plan?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  users?: number;
  orders?: number;
  revenue?: number;
  businessId?: string;
  qrCode?: { code: string; id: string };
}

export interface CreateTenantData {
  name: string;
  slug: string;
  email: string;
  password: string;
  businessName?: string;
}

export interface CreateQuickTenantData {
  name: string;
  email: string;
  password: string;
}

class TenantsService {
  async getTenants(): Promise<Tenant[]> {
    try {
      console.log('[FE Service] Calling GET /tenants');
      const response = await apiClient.get<Tenant[]>('/tenants');
      console.log('[FE Service] GET /tenants response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE Service] GET /tenants error:', error);
      throw this.handleError(error);
    }
  }

  async getCurrentTenant(): Promise<Tenant> {
    try {
      console.log('[FE Service] Calling GET /tenants/current');
      const response = await apiClient.get<Tenant>('/tenants/current');
      console.log('[FE Service] GET /tenants/current response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE Service] GET /tenants/current error:', error);
      throw this.handleError(error);
    }
  }

  async getTenantById(id: string): Promise<Tenant> {
    try {
      console.log(`[FE Service] Calling GET /tenants/${id}`);
      const response = await apiClient.get<Tenant>(`/tenants/${id}`);
      console.log(`[FE Service] GET /tenants/${id} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[FE Service] GET /tenants/${id} error:`, error);
      throw this.handleError(error);
    }
  }

  async createRealTenant(data: CreateTenantData): Promise<any> {
    try {
      console.log('[FE Service] Calling POST /tenants/real');
      const response = await apiClient.post('/tenants/real', data);
      console.log('[FE Service] POST /tenants/real response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE Service] POST /tenants/real error:', error);
      throw this.handleError(error);
    }
  }

  async createQuickTenant(data: CreateQuickTenantData): Promise<any> {
    try {
      console.log('[FE Service] Calling POST /tenants/quick');
      const response = await apiClient.post('/tenants/quick', data);
      console.log('[FE Service] POST /tenants/quick response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE Service] POST /tenants/quick error:', error);
      throw this.handleError(error);
    }
  }

  async generateBusinessQr(): Promise<any> {
    try {
      const response = await apiClient.post('/qr-codes/business/generate');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      return new Error(data.message || `HTTP Error: ${status}`);
    } else if (error.request) {
      return new Error('Network Error: Unable to connect to server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const tenantsService = new TenantsService();