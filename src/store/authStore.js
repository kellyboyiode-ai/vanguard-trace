import { create } from 'zustand';
import { getSession, signOut as authSignOut } from '../services/authService.js';

const initialState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

export const useAuthStore = create((set) => ({
  ...initialState,
  setAuthState: ({ user, session }) =>
    set({
      user: user || null,
      session: session || null,
      error: null,
    }),
  setLoading: (loading) => set({ loading: Boolean(loading) }),
  setError: (error) => set({ error: error || null }),
  clearAuthState: () => set({ ...initialState }),
  hydrateSession: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await getSession();

      if (error) {
        set({
          loading: false,
          error: error.message || 'Could not load session.',
        });
        return;
      }

      const session = data?.session || null;
      set({
        session,
        user: session?.user || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error?.message || 'Could not load session.',
      });
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });

    try {
      const { error } = await authSignOut();

      if (error) {
        set({ loading: false, error: error.message || 'Sign out failed.' });
        return { ok: false, error };
      }

      set({ ...initialState, loading: false });
      return { ok: true, error: null };
    } catch (error) {
      set({ loading: false, error: error?.message || 'Sign out failed.' });
      return { ok: false, error };
    }
  },
}));
