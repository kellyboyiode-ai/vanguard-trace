import { createContext, useEffect, useState } from 'react';
import { supabase, supabaseState } from '../lib/supabase.js';
import { syncMyApprovalState } from '../services/approvalService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [approvalState, setApprovalState] = useState({
    onboarding: null,
    isAdmin: false,
    isApproved: true,
    needsApproval: false,
    error: null,
    source: supabaseState.ready ? 'supabase' : 'local',
  });
  const [loading, setLoading] = useState(() => supabaseState.ready);

  useEffect(() => {
    if (!supabaseState.ready) {
      return;
    }

    let active = true;

    async function syncApprovalForUser(currentUser) {
      if (!currentUser) {
        if (!active) {
          return;
        }

        setApprovalState({
          onboarding: null,
          isAdmin: false,
          isApproved: true,
          needsApproval: false,
          error: null,
          source: 'supabase',
        });
        return;
      }

      const nextApprovalState = await syncMyApprovalState(currentUser);

      if (!active) {
        return;
      }

      setApprovalState({
        onboarding: nextApprovalState.onboarding,
        isAdmin: nextApprovalState.isAdmin,
        isApproved: nextApprovalState.isApproved,
        needsApproval: nextApprovalState.needsApproval,
        error: nextApprovalState.error,
        source: nextApprovalState.source,
      });
    }

    async function initializeSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        await syncApprovalForUser(session?.user ?? null);
      } catch {
        if (!active) {
          return;
        }

        setSession(null);
        setUser(null);
        setApprovalState({
          onboarding: null,
          isAdmin: false,
          isApproved: false,
          needsApproval: false,
          error: null,
          source: 'supabase',
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);

      syncApprovalForUser(session?.user ?? null).finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    onboarding: approvalState.onboarding,
    approvalError: approvalState.error,
    isAdmin: approvalState.isAdmin,
    isApproved: approvalState.isApproved,
    needsApproval: approvalState.needsApproval,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
