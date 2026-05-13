import { supabase, supabaseState } from '../lib/supabase.js';

function clean(value) {
  return String(value ?? '').trim();
}

function validateQuotePayload(payload) {
  const quoteType = clean(payload.quoteType);
  const origin = clean(payload.origin);
  const destination = clean(payload.destination);
  const targetDate = clean(payload.targetDate);
  const name = clean(payload.name);
  const city = clean(payload.city);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const company = clean(payload.company);
  const commodity = clean(payload.commodity);
  const incoterm = clean(payload.incoterm);
  const notes = clean(payload.notes);
  const termsAccepted = Boolean(payload.termsAccepted);
  const captchaAccepted = Boolean(payload.captchaAccepted);

  if (
    !quoteType ||
    !origin ||
    !destination ||
    !targetDate ||
    !name ||
    !city ||
    !email ||
    !phone ||
    !commodity ||
    !incoterm
  ) {
    return {
      valid: false,
      error: 'Please complete all required quote fields.',
      data: null,
    };
  }

  if (!termsAccepted) {
    return {
      valid: false,
      error: 'Please accept the terms before submitting.',
      data: null,
    };
  }

  if (!captchaAccepted) {
    return {
      valid: false,
      error: 'Please complete the anti-bot verification check.',
      data: null,
    };
  }

  return {
    valid: true,
    error: null,
    data: {
      quoteType,
      origin,
      destination,
      targetDate,
      name,
      city,
      email,
      phone,
      company,
      commodity,
      incoterm,
      notes,
      termsAccepted,
      captchaAccepted,
    },
  };
}

export async function submitQuoteRequest(payload) {
  const validation = validateQuotePayload(payload);

  if (!validation.valid) {
    return {
      accepted: false,
      source: 'local',
      error: validation.error,
    };
  }

  if (supabaseState.ready && supabase) {
    const summary = JSON.stringify({
      origin: validation.data.origin,
      destination: validation.data.destination,
      targetDate: validation.data.targetDate,
      city: validation.data.city,
      phone: validation.data.phone,
      company: validation.data.company,
      commodity: validation.data.commodity,
      incoterm: validation.data.incoterm,
      notes: validation.data.notes,
    });

    const { error } = await supabase.from('messages').insert({
      name: validation.data.name,
      email: validation.data.email,
      subject: `${validation.data.quoteType} Quote Request`,
      message: summary,
      channel: 'quote_request',
    });

    if (error) {
      return {
        accepted: false,
        source: 'supabase',
        error: 'Quote submission failed in Supabase. Please retry.',
      };
    }

    return {
      accepted: true,
      source: 'supabase',
      error: null,
    };
  }

  return {
    accepted: true,
    source: 'local',
    error: null,
  };
}
