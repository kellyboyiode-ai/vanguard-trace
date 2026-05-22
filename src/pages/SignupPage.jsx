import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import { createPendingApprovalRequest } from '../services/approvalService.js';
import { getFriendlyAuthErrorMessage, signUpWithEmail } from '../services/authService';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [kycReference, setKycReference] = useState('');
  const [kycVerified, setKycVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!kycVerified) {
      setError(
        'Please confirm your KYC verification is complete before registering.',
      );
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await signUpWithEmail(normalizedEmail, password, {
      full_name: fullName,
      company_name: companyName,
      phone,
    });

    if (!error && data?.user?.id) {
      await createPendingApprovalRequest({
        userId: data.user.id,
        fullName,
        companyName,
        phone,
        kycReference,
        kycVerified,
      });
    }

    setLoading(false);
    if (error) {
      setError(getFriendlyAuthErrorMessage(error));
    } else {
      setMessage(
        'Account created. Complete email or phone confirmation, then wait for admin approval to access the platform.',
      );
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:items-start">
        <div className="rounded-[28px] border border-cyan-950/80 bg-zinc-900/95 p-8 shadow-[0_24px_80px_rgba(2,8,23,0.45)] backdrop-blur">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
            Vanguard Trace Onboarding
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white">Create Account</h1>
          <p className="mb-6 text-sm text-zinc-400">Join Vanguard Trace</p>

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
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="companyName"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Vanguard Trace Partner"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="+1 555 0100"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="kycReference"
              >
                KYC Reference
              </label>
              <input
                id="kycReference"
                type="text"
                required
                value={kycReference}
                onChange={(e) => setKycReference(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="KYC case or ticket ID"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm text-zinc-300"
                htmlFor="confirm"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>
            <label className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <input
                type="checkbox"
                checked={kycVerified}
                onChange={(e) => setKycVerified(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-zinc-300">
                I confirm that my KYC verification has been submitted and can be
                reviewed by the admin.
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <section className="rounded-[28px] border border-cyan-950/70 bg-[linear-gradient(180deg,rgba(5,15,28,0.94),rgba(3,10,21,0.98))] p-4 shadow-[0_24px_80px_rgba(2,8,23,0.4)]">
          <div className="mb-4 rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
              Registration Control Layer
            </p>
            <h2 className="text-xl font-semibold text-cyan-50">
              Verified onboarding for freight operators, customers, and
              partners.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
              New accounts are screened through KYC reference checks, approval
              workflows, and monitored activation before platform access is
              granted.
            </p>
          </div>

          <PageMediaGallery pageKey="signup" title="Registration Visual Set" />
        </section>
      </div>
    </div>
  );
}
