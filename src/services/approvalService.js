import { supabase, supabaseState } from '../lib/supabase.js';

function getDefaultApprovalState() {
  return {
    source: 'local',
    error: null,
    onboarding: null,
    isAdmin: false,
    isApproved: true,
    needsApproval: false,
  };
}

function deriveApprovalState(onboarding, isAdmin) {
  const kycVerified = Boolean(onboarding?.kyc_verified);
  const contactConfirmed = Boolean(onboarding?.contact_confirmed);
  const adminApproved = Boolean(onboarding?.admin_approved);
  const isApproved = Boolean(
    isAdmin || (kycVerified && contactConfirmed && adminApproved),
  );

  return {
    isApproved,
    needsApproval: !isApproved,
  };
}

export async function isCurrentUserAdmin() {
  if (!supabaseState.ready || !supabase) {
    return { isAdmin: false, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('account_admins')
    .select('user_id')
    .maybeSingle();

  return {
    isAdmin: Boolean(data?.user_id),
    source: 'supabase',
    error,
  };
}

export async function upsertAccountOnboarding(payload) {
  if (!supabaseState.ready || !supabase) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase is not configured for onboarding approvals.'),
    };
  }

  const { data, error } = await supabase
    .from('account_onboarding')
    .upsert(payload)
    .select()
    .single();

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}

export async function createPendingApprovalRequest({
  userId,
  fullName,
  companyName,
  phone,
  kycReference,
  kycVerified,
}) {
  if (!supabaseState.ready || !supabase) {
    return {
      source: 'local',
      error: new Error('Supabase is not configured for approval requests.'),
      data: null,
    };
  }

  const onboardingPayload = {
    user_id: userId,
    full_name: fullName || null,
    company_name: companyName || null,
    phone: phone || null,
    kyc_reference: kycReference || null,
    kyc_verified: Boolean(kycVerified),
    contact_confirmed: false,
    admin_approved: false,
    status: 'pending',
    admin_note: null,
  };

  const [customerResult, onboardingResult] = await Promise.all([
    supabase.from('customers').upsert({
      id: userId,
      full_name: fullName || null,
      company_name: companyName || null,
      phone: phone || null,
    }),
    supabase
      .from('account_onboarding')
      .upsert(onboardingPayload)
      .select()
      .single(),
  ]);

  const error = onboardingResult.error || customerResult.error;

  return {
    source: 'supabase',
    error,
    data: onboardingResult.data || null,
  };
}

export async function refreshMyContactConfirmation(user) {
  if (!supabaseState.ready || !supabase || !user?.id) {
    return { source: 'local', data: null, error: null };
  }

  const contactConfirmed = Boolean(
    user.email_confirmed_at || user.phone_confirmed_at,
  );
  const { data, error } = await supabase
    .from('account_onboarding')
    .update({ contact_confirmed: contactConfirmed })
    .eq('user_id', user.id)
    .select()
    .single();

  return {
    source: 'supabase',
    data: data || null,
    error,
  };
}

export async function getMyApprovalState() {
  if (!supabaseState.ready || !supabase) {
    return getDefaultApprovalState();
  }

  const adminResult = await isCurrentUserAdmin();
  if (adminResult.error) {
    return {
      ...getDefaultApprovalState(),
      source: 'supabase',
      error: adminResult.error,
      isApproved: false,
      needsApproval: true,
    };
  }

  const { data, error } = await supabase
    .from('account_onboarding')
    .select('*')
    .maybeSingle();

  if (error) {
    return {
      ...getDefaultApprovalState(),
      source: 'supabase',
      error,
      isAdmin: adminResult.isAdmin,
      isApproved: Boolean(adminResult.isAdmin),
      needsApproval: !adminResult.isAdmin,
    };
  }

  const derived = deriveApprovalState(data, adminResult.isAdmin);

  return {
    source: 'supabase',
    error: null,
    onboarding: data || null,
    isAdmin: adminResult.isAdmin,
    isApproved: derived.isApproved,
    needsApproval: derived.needsApproval,
  };
}

export async function syncMyApprovalState(user) {
  if (!supabaseState.ready || !supabase) {
    return getDefaultApprovalState();
  }

  if (user?.id) {
    await refreshMyContactConfirmation(user);
  }

  return getMyApprovalState();
}

export async function listAccountApprovalRequests() {
  if (!supabaseState.ready || !supabase) {
    return { source: 'local', data: [], error: null };
  }

  const { data, error } = await supabase
    .from('account_onboarding')
    .select('*')
    .order('created_at', { ascending: true });

  return {
    source: 'supabase',
    data: data || [],
    error,
  };
}

export async function approveAccountRequest(userId, adminNote) {
  if (!supabaseState.ready || !supabase) {
    return {
      source: 'local',
      data: null,
      error: new Error('Supabase is not configured for approvals.'),
    };
  }

  const { data, error } = await supabase
    .from('account_onboarding')
    .update({
      admin_approved: true,
      status: 'approved',
      admin_note: adminNote || null,
    })
    .eq('user_id', userId)
    .select()
    .single();

  return {
    source: 'supabase',
    data: data || null,
    error,
  };
}

export async function rejectAccountRequest(userId, adminNote) {
  if (!supabaseState.ready || !supabase) {
    return {
      source: 'local',
      data: null,
      error: new Error('Supabase is not configured for approvals.'),
    };
  }

  const { data, error } = await supabase
    .from('account_onboarding')
    .update({
      admin_approved: false,
      status: 'rejected',
      admin_note: adminNote || null,
    })
    .eq('user_id', userId)
    .select()
    .single();

  return {
    source: 'supabase',
    data: data || null,
    error,
  };
}
