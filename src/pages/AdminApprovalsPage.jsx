import { useCallback, useEffect, useMemo, useState } from 'react';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import {
  approveAccountRequest,
  listAccountApprovalRequests,
  rejectAccountRequest,
} from '../services/approvalService.js';

function formatTimestamp(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUserId, setBusyUserId] = useState('');

  const pendingRequests = useMemo(
    () => requests.filter((item) => item.status === 'pending'),
    [requests],
  );

  const loadRequests = useCallback(async () => {
    const { data, error } = await listAccountApprovalRequests();

    if (error) {
      setError(error.message || 'Could not load account approval requests.');
      setLoading(false);
      return;
    }

    setError('');
    setRequests(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeRequests() {
      const { data, error } = await listAccountApprovalRequests();

      if (!active) {
        return;
      }

      if (error) {
        setError(error.message || 'Could not load account approval requests.');
        setLoading(false);
        return;
      }

      setError('');
      setRequests(data || []);
      setLoading(false);
    }

    initializeRequests();

    return () => {
      active = false;
    };
  }, []);

  async function handleApprove(userId) {
    setBusyUserId(userId);
    const { error } = await approveAccountRequest(userId, 'Approved by admin');
    setBusyUserId('');

    if (error) {
      setError(error.message || 'Could not approve account.');
      return;
    }

    await loadRequests();
  }

  function canApprove(request) {
    return Boolean(request.kyc_verified && request.contact_confirmed);
  }

  async function handleReject(userId) {
    setBusyUserId(userId);
    const { error } = await rejectAccountRequest(
      userId,
      'Rejected by admin pending additional verification',
    );
    setBusyUserId('');

    if (error) {
      setError(error.message || 'Could not reject account.');
      return;
    }

    await loadRequests();
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">Admin Account Approvals</h1>
            <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              Admin Eyes Only
            </span>
          </div>
          <p className="text-zinc-400 mt-2">
            Review KYC and confirmation status before granting platform access.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">
            Loading approval queue...
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="text-lg font-semibold mb-3">Pending requests</h2>

              {pendingRequests.length === 0 ? (
                <p className="text-zinc-400 text-sm">
                  No pending account requests.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-400 border-b border-zinc-800">
                        <th className="text-left py-2 pr-3">User ID</th>
                        <th className="text-left py-2 pr-3">Name</th>
                        <th className="text-left py-2 pr-3">Phone</th>
                        <th className="text-left py-2 pr-3">KYC</th>
                        <th className="text-left py-2 pr-3">
                          Contact Confirmed
                        </th>
                        <th className="text-left py-2 pr-3">Created</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((request) => (
                        <tr
                          key={request.user_id}
                          className="border-b border-zinc-800"
                        >
                          <td className="py-3 pr-3 text-zinc-300">
                            {request.user_id}
                          </td>
                          <td className="py-3 pr-3">
                            {request.full_name || 'N/A'}
                          </td>
                          <td className="py-3 pr-3">
                            {request.phone || 'N/A'}
                          </td>
                          <td className="py-3 pr-3">
                            {request.kyc_verified ? 'Verified' : 'Not verified'}
                          </td>
                          <td className="py-3 pr-3">
                            {request.contact_confirmed
                              ? 'Confirmed'
                              : 'Not confirmed'}
                          </td>
                          <td className="py-3 pr-3">
                            {formatTimestamp(request.created_at)}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={
                                  busyUserId === request.user_id ||
                                  !canApprove(request)
                                }
                                onClick={() => handleApprove(request.user_id)}
                                className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-1.5 rounded"
                                title={
                                  canApprove(request)
                                    ? 'Approve account'
                                    : 'Cannot approve until both KYC and contact confirmation are complete'
                                }
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={busyUserId === request.user_id}
                                onClick={() => handleReject(request.user_id)}
                                className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-xs text-zinc-500 mt-3">
                Approval is only enabled when KYC is verified and contact is
                confirmed.
              </p>
            </section>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="text-lg font-semibold mb-3">Recent decisions</h2>
              <ul className="space-y-2 text-sm text-zinc-300">
                {requests
                  .filter((item) => item.status !== 'pending')
                  .slice(0, 10)
                  .map((item) => (
                    <li key={`${item.user_id}-${item.updated_at}`}>
                      {item.full_name || item.user_id}: {item.status} at{' '}
                      {formatTimestamp(item.updated_at)}
                    </li>
                  ))}
              </ul>
            </section>

              <PageMediaGallery
                pageKey="admin-approvals"
                title="Administrative Review Visual Set"
              />
          </div>
        )}
      </div>
    </div>
  );
}
