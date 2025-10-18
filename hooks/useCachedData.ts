import { useEffect, useState } from 'react';
import { cacheClient } from '@/lib/cacheClient';

interface UseCachedDataOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number;
  autoFetch?: boolean;
}

export const useCachedData = <T>({
  key,
  fetcher,
  ttl = 300,
  autoFetch = true,
}: UseCachedDataOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (force: boolean = false) => {
    // Check cache first unless force refresh
    if (!force) {
      const cached = cacheClient.get<T>(key);
      if (cached) {
        setData(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cacheClient.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const invalidate = () => {
    cacheClient.delete(key);
    fetchData(true);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [key, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidate,
  };
};
