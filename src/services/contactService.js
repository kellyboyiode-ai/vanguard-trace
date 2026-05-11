import { supabase, supabaseState } from '../lib/supabase.js';

function toTrimmedString(value) {
  return String(value || '').trim();
}

function validateContactPayload(payload) {
  const name = toTrimmedString(payload.name);
  const email = toTrimmedString(payload.email);
  const subject = toTrimmedString(payload.subject);
  const message = toTrimmedString(payload.message);

  if (!name || !email || !subject || !message) {
    return {
      isValid: false,
      data: null,
      error: 'Please complete all fields before submitting.',
    };
  }

  return {
    isValid: true,
    data: { name, email, subject, message },
    error: null,
  };
}

export async function submitContactSubmission(payload) {
  const validation = validateContactPayload(payload);

  if (!validation.isValid) {
    return { accepted: false, source: 'local', error: validation.error };
  }

  if (supabaseState.ready && supabase) {
    const { error } = await supabase.from('messages').insert({
      name: validation.data.name,
      email: validation.data.email,
      subject: validation.data.subject,
      message: validation.data.message,
      channel: 'contact_form',
    });

    if (error) {
      return {
        accepted: false,
        source: 'supabase',
        error: 'Failed to submit to Supabase. Please retry.',
      };
    }

    return { accepted: true, source: 'supabase', error: null };
  }

  return {
    accepted: true,
    source: 'local',
    error: null,
  };
}
