import { useState, useCallback } from 'react';
import type { ApiRequestParams, ApiResponse } from '../types';

export const useApiData = (apiUrl: string) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distinctValues, setDistinctValues] = useState<Record<string, any[]>>({});

  const apiCache = new Map<string, { data: ApiResponse; timestamp: number }>();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const createCacheKey = (params: ApiRequestParams): string => JSON.stringify(params);
  const isCacheValid = (timestamp: number): boolean => Date.now() - timestamp < CACHE_DURATION;

  const fetchWithRetry = async (url: string, params: ApiRequestParams, maxRetries = 3): Promise<ApiResponse> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error');
        
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
        
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  const fetchData = useCallback(async (params: ApiRequestParams) => {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = createCacheKey(params);
      const cached = apiCache.get(cacheKey);
      
      if (cached && isCacheValid(cached.timestamp)) {
        setData(cached.data.data);
        setTotal(cached.data.total);
        setDistinctValues(cached.data.distinctValues || {});
        return;
      }

      const result: ApiResponse = await fetchWithRetry(apiUrl, params);
      
      apiCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      setData(result.data);
      setTotal(result.total);
      setDistinctValues(result.distinctValues || {});
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const clearCache = useCallback(() => {
    apiCache.clear();
  }, []);

  const cleanupExpiredCache = useCallback(() => {
    for (const [key, value] of apiCache.entries()) {
      if (!isCacheValid(value.timestamp)) {
        apiCache.delete(key);
      }
    }
  }, []);

  return {
    data,
    total,
    loading,
    error,
    distinctValues,
    fetchData,
    clearCache,
    cleanupExpiredCache
  };
}
