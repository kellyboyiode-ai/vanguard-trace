import { create } from 'zustand';
import {
  getTrackingByCode,
  getTrackingSummary,
} from '../services/trackingService.js';

const initialSummary = {
  inTransit: 0,
  delayed: 0,
  deliveredToday: 0,
};

export const useShipmentStore = create((set) => ({
  summary: initialSummary,
  summarySource: 'demo',
  activeTracking: null,
  trackingSource: 'demo',
  summaryLoading: false,
  trackingLoading: false,
  error: null,
  setError: (error) => set({ error: error || null }),
  clearTracking: () =>
    set({ activeTracking: null, trackingSource: 'demo', error: null }),
  loadSummary: async () => {
    set({ summaryLoading: true, error: null });

    try {
      const result = await getTrackingSummary();
      set({
        summaryLoading: false,
        summary: result?.summary || initialSummary,
        summarySource: result?.source || 'demo',
      });
    } catch {
      set({ summaryLoading: false, error: 'Unable to load tracking summary.' });
    }
  },
  trackByCode: async (trackingCode) => {
    set({ trackingLoading: true, error: null });

    try {
      const result = await getTrackingByCode(trackingCode);
      set({
        trackingLoading: false,
        activeTracking: result?.data || null,
        trackingSource: result?.source || 'demo',
        error: result?.error || null,
      });
    } catch {
      set({
        trackingLoading: false,
        error: 'Unable to fetch tracking details.',
      });
    }
  },
}));
