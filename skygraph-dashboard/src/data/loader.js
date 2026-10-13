import { useStore } from '../store/useStore';
import { DATA_FILES } from '../config/schema';

// In-flight Promise deduplication tracker
const inFlightRequests = new Map();

/**
 * Fetches a JSON file by URL and caches it in Zustand.
 * Deduplicates multiple concurrent requests for the same key.
 * 
 * @param {string} key Unique data key (e.g. 'SUMMARY', 'TOP_HUBS')
 * @param {string} url Endpoint URL (from DATA_FILES)
 * @returns {Promise<any>}
 */
export async function fetchData(key, url) {
  const store = useStore.getState();

  // Return cached result if already present
  if (store.dataCache[key]) {
    return store.dataCache[key];
  }

  // Deduplicate in-flight promises
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }

  store.setLoading(key, true);

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to load ${url}`);
      }

      const json = await response.json();
      store.setData(key, json);
      return json;
    } catch (err) {
      console.error(`[SkyGraph DataLoader] Error loading ${key} from ${url}:`, err);
      store.setError(key, err.message || 'Unknown network error');
      throw err;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}

/**
 * Programmatic helper to load specific datasets on demand
 */
export async function loadDataset(fileKey) {
  const url = DATA_FILES[fileKey];
  if (!url) {
    throw new Error(`Unregistered dataset key: ${fileKey}`);
  }
  return fetchData(fileKey, url);
}

/**
 * Force clear cache and refetch a dataset
 */
export async function reloadDataset(fileKey) {
  const store = useStore.getState();
  const url = DATA_FILES[fileKey];
  if (!url) return;
  // Clear cache entry
  useStore.setState((state) => {
    const nextCache = { ...state.dataCache };
    delete nextCache[fileKey];
    return { dataCache: nextCache };
  });
  return fetchData(fileKey, url);
}
