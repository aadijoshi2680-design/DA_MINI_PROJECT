import { create } from 'zustand';

/**
 * SkyGraph Global Application State Store (Zustand)
 * Adheres to architecture.md section 7.4
 */
export const useStore = create((set, get) => ({
  // Data cache: key -> data payload
  dataCache: {},
  loadingStates: {},
  errorStates: {},

  setData: (key, data) =>
    set((state) => ({
      dataCache: { ...state.dataCache, [key]: data },
      loadingStates: { ...state.loadingStates, [key]: false },
      errorStates: { ...state.errorStates, [key]: null },
    })),

  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: isLoading },
    })),

  setError: (key, error) =>
    set((state) => ({
      errorStates: { ...state.errorStates, [key]: error },
      loadingStates: { ...state.loadingStates, [key]: false },
    })),

  // Global Analytics Filters
  filters: {
    continent: 'All',
    topN: 15,
    activeOnly: true,
  },
  setFilter: (name, value) =>
    set((state) => ({
      filters: { ...state.filters, [name]: value },
    })),
  resetFilters: () =>
    set({
      filters: { continent: 'All', topN: 15, activeOnly: true },
    }),

  // Route Explorer State
  explorer: {
    from: null,
    to: null,
    result: null,
    alternatives: [],
    selectedTab: 'route', // 'route' | 'airport' | 'airline'
  },
  setExplorerOrigin: (airport) =>
    set((state) => ({
      explorer: { ...state.explorer, from: airport },
    })),
  setExplorerDestination: (airport) =>
    set((state) => ({
      explorer: { ...state.explorer, to: airport },
    })),
  swapExplorerAirports: () =>
    set((state) => ({
      explorer: {
        ...state.explorer,
        from: state.explorer.to,
        to: state.explorer.from,
      },
    })),
  setExplorerResult: (result, alternatives = []) =>
    set((state) => ({
      explorer: { ...state.explorer, result, alternatives },
    })),
  setExplorerTab: (tab) =>
    set((state) => ({
      explorer: { ...state.explorer, selectedTab: tab },
    })),

  // Drawer UI state (for chart bar / airport click details)
  drawer: {
    open: false,
    type: null, // 'hub' | 'airline'
    data: null,
  },
  openDrawer: (type, data) =>
    set({
      drawer: { open: true, type, data },
    }),
  closeDrawer: () =>
    set((state) => ({
      drawer: { ...state.drawer, open: false },
    })),
}));
