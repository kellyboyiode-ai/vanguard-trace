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
  const captchaToken = clean(payload.captchaToken);
  const recaptchaEnabled = Boolean(payload.recaptchaEnabled);

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

  if (recaptchaEnabled && !captchaToken) {
    return {
      valid: false,
      error: 'Please complete the reCAPTCHA challenge.',
      data: null,
    };
  }

  if (!recaptchaEnabled && !captchaAccepted) {
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
      captchaToken,
      recaptchaEnabled,
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

  if (validation.data.recaptchaEnabled && (!supabaseState.ready || !supabase)) {
    return {
      accepted: false,
      source: 'local',
      error:
        'Secure captcha verification is unavailable. Configure Supabase to submit quote requests.',
    };
  }

  if (supabaseState.ready && supabase) {
    if (validation.data.recaptchaEnabled) {
      const { data: verifyResult, error: verifyError } =
        await supabase.functions.invoke('verify-recaptcha', {
          body: {
            token: validation.data.captchaToken,
          },
        });

      if (verifyError || !verifyResult?.success) {
        return {
          accepted: false,
          source: 'supabase',
          error:
            verifyResult?.error ||
            'reCAPTCHA verification failed. Please retry the challenge.',
        };
      }
    }

    const { error } = await supabase.from('quote_requests').insert({
      quote_type: validation.data.quoteType,
      origin: validation.data.origin,
      destination: validation.data.destination,
      target_date: validation.data.targetDate,
      contact_name: validation.data.name,
      city: validation.data.city,
      email: validation.data.email,
      phone: validation.data.phone,
      company: validation.data.company || null,
      commodity: validation.data.commodity,
      incoterm: validation.data.incoterm,
      notes: validation.data.notes || null,
      terms_accepted: validation.data.termsAccepted,
      captcha_provider: validation.data.recaptchaEnabled
        ? 'google_recaptcha'
        : 'manual_checkbox',
      captcha_token: validation.data.captchaToken || null,
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
