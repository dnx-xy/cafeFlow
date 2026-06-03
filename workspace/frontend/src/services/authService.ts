// src/services/authService.ts
import apiClient from '@/lib/apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  businessName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  businessId: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface SwitchTenantResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await apiClient.post<User>('/auth/register', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Send logout request to backend if needed
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if backend logout fails, we still clear local storage
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async switchTenant(tenantId: string): Promise<SwitchTenantResponse> {
    try {
      console.log('[FE AuthService] Switching tenant to:', tenantId);
      const response = await apiClient.post<SwitchTenantResponse>('/auth/switch-tenant', { tenantId });
      console.log('[FE AuthService] Tenant switched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE AuthService] Error switching tenant:', error);
      throw this.handleError(error);
    }
  }

  // Helper method to handle API errors
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === 401) {
        // Clear tokens on unauthorized access
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      return new Error(data.message || `HTTP Error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: Unable to connect to server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();