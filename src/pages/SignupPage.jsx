import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPendingApprovalRequest } from '../services/approvalService.js';
import { signUpWithEmail } from '../services/authService';

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

    const { data, error } = await signUpWithEmail(email, password, {
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
      setError(error.message);
    } else {
      setMessage(
        'Account created. Complete email or phone confirmation, then wait for admin approval to access the platform.',
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-zinc-400 text-sm mb-6">Join Vanguard Trace</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm text-zinc-300 mb-1"
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label
              className="block text-sm text-zinc-300 mb-1"
              htmlFor="companyName"
            >
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Vanguard Logistics"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="+1 555 0100"
            />
          </div>
          <div>
            <label
              className="block text-sm text-zinc-300 mb-1"
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="KYC case or ticket ID"
            />
          </div>
          <div>
            <label
              className="block text-sm text-zinc-300 mb-1"
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label
              className="block text-sm text-zinc-300 mb-1"
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
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
    </div>
  );
}
