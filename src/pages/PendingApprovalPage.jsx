import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
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
  }, [onboarding, session?.user?.email_confirmed_at, session?.user?.phone_confirmed_at]);

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sign in required</h1>
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Account pending approval</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Your account exists, but access is blocked until all verification checks are complete and an admin approves your registration.
        </p>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 mb-6">
          <h2 className="text-sm font-semibold text-zinc-200 mb-3">Verification checklist</h2>
          <ul className="space-y-2 text-sm">
            <li className={verificationChecklist.emailOrPhone ? 'text-emerald-400' : 'text-zinc-400'}>
              {verificationChecklist.emailOrPhone ? 'Completed' : 'Pending'}: Email or phone confirmation
            </li>
            <li className={verificationChecklist.kycVerified ? 'text-emerald-400' : 'text-zinc-400'}>
              {verificationChecklist.kycVerified ? 'Completed' : 'Pending'}: KYC verification submitted
            </li>
            <li className={verificationChecklist.adminApproved ? 'text-emerald-400' : 'text-zinc-400'}>
              {verificationChecklist.adminApproved ? 'Completed' : 'Pending'}: Admin approval
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            Sign Out
          </button>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
          >
            Re-check after verification
          </Link>
        </div>
      </div>
    </div>
  );
}
