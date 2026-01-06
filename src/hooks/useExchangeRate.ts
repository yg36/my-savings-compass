import { useState, useEffect, useCallback } from 'react';
import { ExchangeRateData } from '@/types/goal';

const CACHE_KEY = 'savings-planner-exchange-rate';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data: ExchangeRateData & { timestamp: number } = JSON.parse(cached);
        const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
        if (!isExpired) {
          setRate(data.rate);
          setLastUpdated(data.lastUpdated);
          return true;
        }
      } catch {
        // Invalid cache, will fetch fresh
      }
    }
    return false;
  }, []);

  const fetchRate = useCallback(async (force = false) => {
    if (!force && loadFromCache()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data = await response.json();
      const inrRate = data.rates.INR;
      const updatedAt = new Date().toISOString();

      setRate(inrRate);
      setLastUpdated(updatedAt);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          rate: inrRate,
          lastUpdated: updatedAt,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate');
      // Try to use cached data even if expired
      loadFromCache();
    } finally {
      setIsLoading(false);
    }
  }, [loadFromCache]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const refresh = useCallback(() => {
    fetchRate(true);
  }, [fetchRate]);

  const convertToUSD = useCallback(
    (amountINR: number) => (rate ? amountINR / rate : null),
    [rate]
  );

  const convertToINR = useCallback(
    (amountUSD: number) => (rate ? amountUSD * rate : null),
    [rate]
  );

  return {
    rate,
    lastUpdated,
    isLoading,
    error,
    refresh,
    convertToUSD,
    convertToINR,
  };
}
