import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import { useAuth } from '../context/useAuth.jsx';
import { signOut } from '../services/authService.js';

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const { session, onboarding, isApproved, isAdmin } = useAuth();

  const verificationChecklist = useMemo(() => {
    const contactConfirmed = Boolean(
      session?.user?.email_confirmed_at ||
      session?.user?.phone_confirmed_at ||
      onboarding?.contact_confirmed,
    );

    return {
      emailOrPhone: contactConfirmed,
      kycVerified: Boolean(onboarding?.kyc_verified),
      adminApproved: Boolean(onboarding?.admin_approved),
    };
  }, [
    onboarding,
    session?.user?.email_confirmed_at,
    session?.user?.phone_confirmed_at,
  ]);

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Sign in required
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            Please sign in to check your account approval status.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isApproved || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 sm:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:items-start">
        <div className="rounded-[28px] border border-cyan-950/80 bg-zinc-900/95 p-8 shadow-[0_24px_80px_rgba(2,8,23,0.45)] backdrop-blur">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
            Vanguard Trace Approval
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Account pending approval
          </h1>
          <p className="mb-6 text-sm text-zinc-400">
            Your account exists, but access is blocked until all verification
            checks are complete and an admin approves your registration.
          </p>

          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-200">
              Verification checklist
            </h2>
            <ul className="space-y-2 text-sm">
              <li
                className={
                  verificationChecklist.emailOrPhone
                    ? 'text-emerald-400'
                    : 'text-zinc-400'
                }
              >
                {verificationChecklist.emailOrPhone ? 'Completed' : 'Pending'}:
                Email or phone confirmation
              </li>
              <li
                className={
                  verificationChecklist.kycVerified
                    ? 'text-emerald-400'
                    : 'text-zinc-400'
                }
              >
                {verificationChecklist.kycVerified ? 'Completed' : 'Pending'}:
                KYC verification submitted
              </li>
              <li
                className={
                  verificationChecklist.adminApproved
                    ? 'text-emerald-400'
                    : 'text-zinc-400'
                }
              >
                {verificationChecklist.adminApproved ? 'Completed' : 'Pending'}:
                Admin approval
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              Sign Out
            </button>
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Re-check after verification
            </Link>
          </div>
        </div>

        <section className="rounded-[28px] border border-cyan-950/70 bg-[linear-gradient(180deg,rgba(5,15,28,0.94),rgba(3,10,21,0.98))] p-4 shadow-[0_24px_80px_rgba(2,8,23,0.4)]">
          <div className="mb-4 rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-300/70">
              Approval Queue Layer
            </p>
            <h2 className="text-xl font-semibold text-cyan-50">
              Account activation remains locked until verification clears.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
              Pending accounts stay visible inside the Vanguard Trace approval workflow so operators can track verification state, queue status, and release conditions.
            </p>
          </div>

          <PageMediaGallery pageKey="pending-approval" title="Approval Queue Visual Set" />
        </section>
      </div>
    </div>
  );
}
