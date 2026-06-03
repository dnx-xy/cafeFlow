'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CurrencyCode } from '@/lib/currency';
import apiClient from '@/lib/apiClient';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const STORAGE_KEY = 'cafeflow_currency';

function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored as CurrencyCode;
  return 'USD';
}

function storeCurrency(code: CurrencyCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, code);
  }
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  setCurrency: () => {},
});

export function CurrencyProvider({ businessId, children }: { businessId?: string; children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getStoredCurrency);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    storeCurrency(code);
  }, []);

  useEffect(() => {
    if (!businessId) return;
    (async () => {
      try {
        const res = await apiClient.get(`/businesses/${businessId}`);
        const backendCurrency = res.data?.currency as CurrencyCode;
        if (backendCurrency) {
          setCurrency(backendCurrency);
        }
      } catch {
        // keep localStorage value
      }
    })();
  }, [businessId]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
