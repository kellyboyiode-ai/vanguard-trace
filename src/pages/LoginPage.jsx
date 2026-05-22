import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import { syncMyApprovalState } from '../services/approvalService.js';
import {
  getSession,
  requestPasswordReset,
  signInWithEmail,
} from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  function getFriendlyAuthErrorMessage(message) {
    if (!message) {
      return 'Unable to sign in. Please try again.';
    }

    if (message === 'Invalid login credentials') {
      return 'Email or password is incorrect, or the account is not fully activated yet. If this is a new account, sign up first and complete email confirmation.';
    }

    return message;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await signInWithEmail(normalizedEmail, password);

    if (error) {
      setLoading(false);
      setError(getFriendlyAuthErrorMessage(error.message));
      return;
    }

    const { data: sessionData } = await getSession();
    const signedInUser = sessionData?.session?.user || null;

    if (signedInUser) {
      const approvalState = await syncMyApprovalState(signedInUser);

      if (!approvalState.isAdmin && !approvalState.isApproved) {
        setLoading(false);
        navigate('/pending-approval', { replace: true });
        return;
      }
    }

    setLoading(false);
    navigate('/');
  }

  async function handleForgotPassword() {
    const normalizedEmail = email.trim().toLowerCase();
    setError('');
    setMessage('');

    if (!normalizedEmail) {
      setError('Enter your email first, then select Forgot Password.');
      return;
    }

    setResetLoading(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await requestPasswordReset(normalizedEmail, redirectTo);
    setResetLoading(false);

    if (error) {
      setError(error.message || 'Password reset request failed.');
      return;
    }

    setMessage(
      'Reset link dispatched. Check your inbox and follow the secure recovery link.',
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-center">
        <div className="rounded-[28px] border border-cyan-950/80 bg-zinc-900/95 p-8 shadow-[0_24px_80px_rgba(2,8,23,0.45)] backdrop-blur">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
            Encrypted Vanguard Trace Access
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white">Cipher Entry</h1>
          <p className="mb-4 text-sm text-zinc-400">
            Establish a secured session to access your Vanguard Trace.
          </p>

          <div className="mb-6 rounded-lg border border-emerald-800/70 bg-emerald-950/30 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/90">
            Session tunnel: TLS-protected auth via Supabase
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-lg border border-green-700 bg-green-900/40 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm uppercase tracking-[0.14em] text-zinc-300"
                htmlFor="email"
              >
                Identity Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm uppercase tracking-[0.14em] text-zinc-300"
                htmlFor="password"
              >
                Passphrase
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">Credential payload is never stored in browser state.</p>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading || loading}
                className="text-xs font-medium uppercase tracking-[0.12em] text-cyan-400 transition-colors hover:text-cyan-300 disabled:opacity-50"
              >
                {resetLoading ? 'Dispatching…' : 'Forgot Password'}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Decrypting session…' : 'Sign-In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <section className="rounded-[28px] border border-cyan-950/70 bg-[linear-gradient(180deg,rgba(5,15,28,0.94),rgba(3,10,21,0.98))] p-4 shadow-[0_24px_80px_rgba(2,8,23,0.4)]">
          <div className="mb-4 rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
              Secure Access Layer
            </p>
            <h2 className="text-xl font-semibold text-cyan-50">
              Identity, approval, and monitoring in one control surface.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
              Every account request moves through a verified Vanguard Trace
              workflow with security telemetry, approval gating, and operator
              visibility.
            </p>
          </div>

          <PageMediaGallery pageKey="login" title="Secure Access Visual Set" />
        </section>
      </div>
    </div>
  );
}
