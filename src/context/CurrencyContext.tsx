'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode } from '@/types';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatUGX: (amountUGX: number, showDecimals?: boolean) => string;
  convertUGXToActive: (amountUGX: number) => number;
  formatCurrencyAmount: (amountUGX: number, code?: CurrencyCode) => {
    symbol: string;
    value: string;
    fullString: string;
    code: CurrencyCode;
  };
  rates: {
    UGX: number; // 1 USD = 3750 UGX
    KES: number; // 1 USD = 130 KES
    USD: number; // 1 USD = 1 USD
  };
}

const RATES = {
  UGX: 3750, // 3,750 UGX per 1 USD
  KES: 130,  // 130 KES per 1 USD
  USD: 1,    // 1 USD
};

const SYMBOLS: Record<CurrencyCode, string> = {
  UGX: 'USh',
  KES: 'KSh',
  USD: '$',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('UGX');

  useEffect(() => {
    const saved = localStorage.getItem('gcc_preferred_currency') as CurrencyCode | null;
    if (saved && (saved === 'UGX' || saved === 'KES' || saved === 'USD')) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('gcc_preferred_currency', c);
  };

  const convertUGXToActive = (amountUGX: number): number => {
    if (currency === 'UGX') return amountUGX;
    const usd = amountUGX / RATES.UGX;
    if (currency === 'USD') return usd;
    if (currency === 'KES') return usd * RATES.KES;
    return amountUGX;
  };

  const formatCurrencyAmount = (amountUGX: number, overrideCode?: CurrencyCode) => {
    const activeCode = overrideCode || currency;
    let convertedValue: number;
    let symbol = SYMBOLS[activeCode];

    if (activeCode === 'UGX') {
      convertedValue = amountUGX;
      return {
        symbol: 'UGX',
        value: Math.round(convertedValue).toLocaleString('en-US'),
        fullString: `UGX ${Math.round(convertedValue).toLocaleString('en-US')}`,
        code: activeCode,
      };
    } else if (activeCode === 'KES') {
      const usd = amountUGX / RATES.UGX;
      convertedValue = usd * RATES.KES;
      return {
        symbol: 'KES',
        value: Math.round(convertedValue).toLocaleString('en-US'),
        fullString: `KES ${Math.round(convertedValue).toLocaleString('en-US')}`,
        code: activeCode,
      };
    } else {
      convertedValue = amountUGX / RATES.UGX;
      return {
        symbol: '$',
        value: convertedValue.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        fullString: `$${Math.round(convertedValue).toLocaleString('en-US')}`,
        code: activeCode,
      };
    }
  };

  const formatUGX = (amountUGX: number): string => {
    return formatCurrencyAmount(amountUGX).fullString;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatUGX,
        convertUGXToActive,
        formatCurrencyAmount,
        rates: RATES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
