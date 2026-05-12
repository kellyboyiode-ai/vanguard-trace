import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  activePanel: 'overview',
  quickFilters: {
    criticalOnly: false,
    includeResolved: true,
  },
  setSidebarOpen: (open) => set({ sidebarOpen: Boolean(open) }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel || 'overview' }),
  setQuickFilter: (key, value) =>
    set((state) => ({
      quickFilters: {
        ...state.quickFilters,
        [key]: Boolean(value),
      },
    })),
  resetUiState: () =>
    set({
      sidebarOpen: false,
      activePanel: 'overview',
      quickFilters: {
        criticalOnly: false,
        includeResolved: true,
      },
    }),
}));
