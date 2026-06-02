'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '@/lib/currency';
import { useBusiness } from '@/hooks/useBusiness';

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { business, fetchBusiness, loading } = useBusiness();
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    if (business?.currency) {
      setCurrency(business.currency as CurrencyCode);
    }
  }, [business?.currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
