import { supabase, supabaseState } from '../lib/supabase.js';

function assertAuthReady() {
  if (!supabaseState.ready || !supabase) {
    throw new Error('Supabase auth is not configured.');
  }
}

export async function signUpWithEmail(email, password, metadata = {}) {
  assertAuthReady();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

export async function signInWithEmail(email, password) {
  assertAuthReady();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function requestPasswordReset(email, redirectTo) {
  assertAuthReady();

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

export async function updatePassword(password) {
  assertAuthReady();
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  assertAuthReady();
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabaseState.ready || !supabase) {
    return { data: { session: null }, error: null };
  }

  return supabase.auth.getSession();
}
