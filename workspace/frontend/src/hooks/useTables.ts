import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';

// Define types
export interface Table {
  id: string;
  tableNumber: string;
  name: string;
  outletId: string;
  tenantId: string;
  isActive: boolean;
  capacity: number;
  qrCode?: {
    id: string;
    code: string;
    scannedAt: string;
    isActive: boolean;
  };
}

// Tables context
export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async (outletId?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (outletId) params.append('outletId', outletId);
      
      const queryString = params.toString();
      const url = queryString ? `/tables?${queryString}` : '/tables';
      
      const response = await apiClient.get<{ data: Table[]; pagination: any }>(url);
      setTables(response.data.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tables';
      setError(errorMessage);
      toast.error('Failed to load tables');
      console.error('Tables fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (tableData: Partial<Table>) => {
    try {
      const response = await apiClient.post<Table>('/tables', tableData);
      setTables(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create table';
      toast.error('Failed to create table');
      throw err;
    }
  };

  const updateTable = async (id: string, tableData: Partial<Table>) => {
    try {
      const response = await apiClient.put<Table>(`/tables/${id}`, tableData);
      setTables(prev => prev.map(table => table.id === id ? response.data : table));
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update table';
      toast.error('Failed to update table');
      throw err;
    }
  };

  const deleteTable = async (id: string) => {
    try {
      await apiClient.delete(`/tables/${id}`);
      setTables(prev => prev.filter(table => table.id !== id));
      toast.success('Table deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete table';
      toast.error('Failed to delete table');
      throw err;
    }
  };

  const generateQrCode = async (tableId: string) => {
    try {
      const response = await apiClient.post(`/qr-codes/generate`, { tableId });
      // Update the table with the new QR code
      setTables(prev => prev.map(table => 
        table.id === tableId 
          ? { ...table, qrCode: response.data } 
          : table
      ));
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QR code';
      toast.error('Failed to generate QR code');
      throw err;
    }
  };

  return {
    tables,
    loading,
    error,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    generateQrCode
  };
};