'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CurrencyCode, ExchangeRates } from '@/types';

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
}

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
  currencyOptions: CurrencyOption[];
  rates: ExchangeRates;
  ratesUpdatedAt: string | null;
}

const FALLBACK_RATES: ExchangeRates = { UGX: 3750, KES: 130, USD: 1 };
const FALLBACK_CURRENCIES: CurrencyOption[] = [
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'USD', name: 'US Dollar' },
];
const STORAGE_KEY = 'gcc_preferred_currency';
const RATES_URL = 'https://open.er-api.com/v6/latest/USD';

function getSupportedCurrencies(extraCodes: string[] = []): CurrencyOption[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'currency') => string[] };
  let codes = extraCodes;
  try {
    codes = [...codes, ...(intl.supportedValuesOf?.('currency') ?? [])];
  } catch {
    // The exchange-rate response and fallback list still provide supported choices.
  }
  codes = [...new Set([...codes, ...FALLBACK_CURRENCIES.map(({ code }) => code)])]
    .filter((code) => /^[A-Z]{3}$/.test(code))
    .sort((a, b) => a.localeCompare(b));

  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames(['en'], { type: 'currency' });
  } catch {
    names = undefined;
  }

  return codes.map((code) => ({ code, name: names?.of(code) ?? code }));
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('UGX');
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>(FALLBACK_CURRENCIES);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let savedCurrency = 'UGX';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && /^[A-Z]{3}$/.test(saved)) savedCurrency = saved;
    } catch {
      // Keep the default currency when browser storage is unavailable.
    }
    setCurrencyOptions(getSupportedCurrencies());

    const controller = new AbortController();
    fetch(RATES_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load exchange rates.');
        return response.json();
      })
      .then((data: { result?: string; base_code?: string; time_last_update_utc?: string; rates?: Record<string, number> }) => {
        if (data.result !== 'success' || data.base_code !== 'USD' || !data.rates) throw new Error('Exchange rates were unavailable.');
        const nextRates: ExchangeRates = { ...FALLBACK_RATES, ...data.rates, USD: 1 };
        setRates(nextRates);
        setCurrencyOptions(getSupportedCurrencies(Object.keys(nextRates)));
        setCurrencyState(nextRates[savedCurrency] ? savedCurrency : 'UGX');
        setRatesUpdatedAt(data.time_last_update_utc ?? null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCurrencyOptions(getSupportedCurrencies(Object.keys(FALLBACK_RATES)));
          setCurrencyState(FALLBACK_RATES[savedCurrency] ? savedCurrency : 'UGX');
        }
      });

    return () => controller.abort();
  }, []);

  const setCurrency = (nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency);
    try {
      localStorage.setItem(STORAGE_KEY, nextCurrency);
    } catch {
      // Currency selection remains active for this session if storage is unavailable.
    }
  };

  const convertUGXToActive = (amountUGX: number): number => {
    const targetRate = rates[currency];
    const ugxPerUsd = rates.UGX;
    if (!targetRate || !ugxPerUsd) return amountUGX;
    return (amountUGX / ugxPerUsd) * targetRate;
  };

  const formatCurrencyAmount = (amountUGX: number, overrideCode?: CurrencyCode) => {
    const activeCode = overrideCode || currency;
    const targetRate = rates[activeCode];
    const convertedValue = targetRate && rates.UGX ? (amountUGX / rates.UGX) * targetRate : amountUGX;
    try {
      const value = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(convertedValue);
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: activeCode,
        currencyDisplay: 'code',
      });
      const symbolFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: activeCode });
      const symbol = symbolFormatter.formatToParts(convertedValue).find((part) => part.type === 'currency')?.value ?? activeCode;
      return { symbol, value, fullString: currencyFormatter.format(convertedValue), code: activeCode };
    } catch {
      return { symbol: activeCode, value: convertedValue.toLocaleString('en-US'), fullString: `${activeCode} ${convertedValue.toLocaleString('en-US')}`, code: activeCode };
    }
  };

  const formatUGX = (amountUGX: number): string => formatCurrencyAmount(amountUGX).fullString;

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatUGX,
    convertUGXToActive,
    formatCurrencyAmount,
    currencyOptions,
    rates,
    ratesUpdatedAt,
  }), [currency, currencyOptions, rates, ratesUpdatedAt]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
}