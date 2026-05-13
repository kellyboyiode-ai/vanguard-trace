import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get('RECAPTCHA_SECRET_KEY') || '';
    if (!secret) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'RECAPTCHA_SECRET_KEY is not configured for Edge Functions.',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const payload = await request.json();
    const token = String(payload?.token || '').trim();

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing captcha token.',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const params = new URLSearchParams();
    params.set('secret', secret);
    params.set('response', token);

    const verifyResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );

    if (!verifyResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Captcha provider request failed.',
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const verifyJson = await verifyResponse.json();

    if (!verifyJson.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Captcha challenge verification was rejected.',
          codes: verifyJson['error-codes'] || [],
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid verification request payload.',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
