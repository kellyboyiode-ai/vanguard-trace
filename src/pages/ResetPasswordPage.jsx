import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import { getSession, updatePassword } from '../services/authService';
import { supabaseState } from '../lib/supabase.js';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validRecoverySession, setValidRecoverySession] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkRecoverySession() {
      if (!supabaseState.ready) {
        if (!active) {
          return;
        }

        setError('Supabase auth is not configured for password recovery.');
        return;
      }

      const { data } = await getSession();
      const hasRecoverySession = Boolean(data?.session);

      if (!active) {
        return;
      }

      setValidRecoverySession(hasRecoverySession);
      if (!hasRecoverySession) {
        setError(
          'Recovery session is missing or expired. Request a new reset link from the login page.',
        );
      }
    }

    checkRecoverySession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validRecoverySession) {
      setError(
        'Your secure recovery session is no longer active. Request a new reset link.',
      );
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError(error.message || 'Could not update password.');
      return;
    }

    setMessage(
      'Password updated successfully. Redirecting to secure sign-in...',
    );
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-center">
        <div className="rounded-[28px] border border-cyan-950/80 bg-zinc-900/95 p-8 shadow-[0_24px_80px_rgba(2,8,23,0.45)] backdrop-blur">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
            Encrypted Recovery Channel
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Reset Passphrase
          </h1>
          <p className="mb-4 text-sm text-zinc-400">
            Complete your secure credential rotation.
          </p>

          <div className="mb-6 rounded-lg border border-emerald-800/70 bg-emerald-950/30 px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/90">
            Recovery tunnel: TLS-protected token exchange
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
                htmlFor="password"
              >
                New Passphrase
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm uppercase tracking-[0.14em] text-zinc-300"
                htmlFor="confirmPassword"
              >
                Confirm Passphrase
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Repeat passphrase"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !validRecoverySession}
              className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Updating credentials…' : 'Apply Credential Rotation'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Return to{' '}
            <Link to="/login" className="text-cyan-400 hover:underline">
              secure sign-in
            </Link>
          </p>
        </div>

        <section className="rounded-[28px] border border-cyan-950/70 bg-[linear-gradient(180deg,rgba(5,15,28,0.94),rgba(3,10,21,0.98))] p-4 shadow-[0_24px_80px_rgba(2,8,23,0.4)]">
          <div className="mb-4 rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
              Credential Recovery Layer
            </p>
            <h2 className="text-xl font-semibold text-cyan-50">
              Rotate access credentials through a verified recovery session.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
              This flow requires a valid recovery link generated from your
              registered email and secures updates through the active token
              session.
            </p>
          </div>

          <PageMediaGallery pageKey="login" title="Secure Access Visual Set" />
        </section>
      </div>
    </div>
  );
}
