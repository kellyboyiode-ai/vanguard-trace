import { supabase, supabaseState } from '../lib/supabase.js';

const AUTH_INFRASTRUCTURE_ERROR_PATTERNS = [
  'failed to fetch',
  'fetch failed',
  'load failed',
  'network request failed',
  'networkerror',
  'project has been paused',
  'project is paused',
  'paused',
  'inactive project',
];

function assertAuthReady() {
  if (!supabaseState.ready || !supabase) {
    throw new Error(
      'Supabase auth is not configured. Add valid credentials or disable live auth for demo mode.',
    );
  }
}

export function getSupabaseAuthUnavailableMessage() {
  return 'Vanguard Trace auth is temporarily offline because the Supabase project is paused or unreachable. Unpause the hosted Supabase project in the Supabase dashboard, or run npm run dev:full to use the local stack.';
}

export function isSupabaseInfrastructureError(error) {
  const normalizedMessage = String(error?.message || error || '')
    .trim()
    .toLowerCase();

  return AUTH_INFRASTRUCTURE_ERROR_PATTERNS.some((pattern) =>
    normalizedMessage.includes(pattern),
  );
}

export function normalizeAuthError(error) {
  if (isSupabaseInfrastructureError(error)) {
    return new Error(getSupabaseAuthUnavailableMessage());
  }

  if (error instanceof Error) {
    return error;
  }

  const message = String(error || '').trim();
  return new Error(message || 'Unable to complete the auth request.');
}

export function getFriendlyAuthErrorMessage(error) {
  const message = String(normalizeAuthError(error)?.message || '')
    .trim()
    .toLowerCase();

  if (!message) {
    return 'Unable to sign in. Please try again.';
  }

  if (message.includes('email not confirmed')) {
    return 'Your email is not confirmed yet. Open your inbox and confirm your account, or resend a new confirmation link below.';
  }

  if (message.includes('invalid login credentials')) {
    return 'Email or password is incorrect, or the account is not fully activated yet. If this is a new account, sign up first and complete email confirmation.';
  }

  if (message.includes('signups not allowed for otp')) {
    return 'No active account was found for this email. Create an account first, then confirm your email before signing in.';
  }

  return normalizeAuthError(error).message;
}

async function runAuthRequest(operation, fallbackData = null) {
  try {
    const result = await operation();

    if (result?.error) {
      return {
        ...result,
        error: normalizeAuthError(result.error),
      };
    }

    return result;
  } catch (error) {
    return {
      data: fallbackData,
      error: normalizeAuthError(error),
    };
  }
}

export async function signUpWithEmail(email, password, metadata = {}) {
  return runAuthRequest(async () => {
    assertAuthReady();

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : undefined;

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });
  });
}

export async function signInWithEmail(email, password) {
  return runAuthRequest(async () => {
    assertAuthReady();
    return supabase.auth.signInWithPassword({ email, password });
  });
}

export async function signInWithMagicLink(email) {
  return runAuthRequest(async () => {
    assertAuthReady();

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : undefined;

    return supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });
  });
}

export async function resendSignupConfirmationEmail(email) {
  return runAuthRequest(async () => {
    assertAuthReady();

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : undefined;

    return supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    });
  });
}

export async function requestPasswordReset(email, redirectTo) {
  return runAuthRequest(async () => {
    assertAuthReady();

    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  });
}

export async function updatePassword(password) {
  return runAuthRequest(async () => {
    assertAuthReady();
    return supabase.auth.updateUser({ password });
  });
}

export async function signOut() {
  return runAuthRequest(async () => {
    assertAuthReady();
    return supabase.auth.signOut();
  });
}

export async function getSession() {
  if (!supabaseState.ready || !supabase) {
    return { data: { session: null }, error: null };
  }

  return runAuthRequest(() => supabase.auth.getSession(), { session: null });
}
