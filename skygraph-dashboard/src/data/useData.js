import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { DATA_FILES } from '../config/schema';
import { fetchData, reloadDataset } from './loader';

/**
 * Custom React hook for fetching and subscribing to cached dataset files.
 * 
 * @param {string} fileKey Key from DATA_FILES (e.g. 'SUMMARY', 'TOP_HUBS')
 * @param {Object} options Configuration options
 * @param {boolean} options.lazy When true, does not automatically fetch on mount
 * @returns {{ data: any, loading: boolean, error: string|null, reload: () => Promise<any> }}
 */
export function useData(fileKey, options = {}) {
  const { lazy = false } = options;

  const data = useStore((state) => state.dataCache[fileKey]);
  const loading = useStore((state) => state.loadingStates[fileKey] ?? (!data && !lazy));
  const error = useStore((state) => state.errorStates[fileKey] || null);

  const fetchCurrent = useCallback(() => {
    const url = DATA_FILES[fileKey];
    if (!url) {
      console.warn(`[useData] Unknown data key requested: "${fileKey}"`);
      return Promise.reject(new Error(`Unknown data key "${fileKey}"`));
    }
    return fetchData(fileKey, url);
  }, [fileKey]);

  useEffect(() => {
    if (!lazy && !data && !error) {
      fetchCurrent().catch(() => {
        // Error state handled inside store
      });
    }
  }, [fileKey, lazy, data, error, fetchCurrent]);

  const reload = useCallback(() => {
    return reloadDataset(fileKey);
  }, [fileKey]);

  return {
    data,
    loading: Boolean(loading),
    error,
    reload,
    fetch: fetchCurrent,
  };
}

export default useData;
