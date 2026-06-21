// Edge Function: newsletter-subscribe
// Stores a pending subscriber and emails a double-opt-in confirmation link.
//
// Deploy:  supabase functions deploy newsletter-subscribe

import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  clientIp,
  corsHeaders,
  isValidEmail,
  json,
  verifyTurnstile,
} from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ error: 'Invalid body' }, 400);

    const email = String(body.email ?? '').trim().toLowerCase();
    const source = String(body.source ?? '').trim() || null;
    const honeypot = String(body.company_website ?? '');
    const token = String(body.turnstileToken ?? '');

    if (honeypot) return json({ ok: true });
    if (!isValidEmail(email)) return json({ error: 'Invalid email' }, 400);

    if (!(await verifyTurnstile(token, clientIp(req)))) {
      return json({ error: 'Verification failed. Please try again.' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );

    // Upsert: keep idempotent if someone subscribes twice.
    const { data, error } = await supabase
      .from('subscribers')
      .upsert(
        { email, source, status: 'pending' },
        { onConflict: 'email', ignoreDuplicates: false },
      )
      .select('confirm_token, status')
      .single();

    if (error || !data) {
      console.error('upsert subscribers failed:', error);
      return json({ error: 'Could not subscribe.' }, 500);
    }

    // Already confirmed — nothing more to do.
    if (data.status === 'confirmed') return json({ ok: true, alreadyConfirmed: true });

    await sendConfirmation(email, data.confirm_token as string).catch((e) =>
      console.error('confirmation email failed:', e),
    );

    return json({ ok: true });
  } catch (e) {
    console.error('newsletter-subscribe error:', e);
    return json({ error: 'Unexpected error' }, 500);
  }
});

async function sendConfirmation(email: string, token: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('EMAIL_FROM');
  const functionsUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1`;
  const confirmUrl = `${functionsUrl}/newsletter-confirm?token=${encodeURIComponent(token)}`;

  if (!apiKey || !from) {
    // Not configured: log the link so dev can confirm manually.
    console.log('[dev] confirmation link:', confirmUrl);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Confirm your subscription to contAInuum',
      html: `<p>Confirm your subscription by clicking the link below:</p>
             <p><a href="${confirmUrl}">Confirm subscription</a></p>
             <p>If you didn't request this, you can ignore this email.</p>`,
    }),
  });
}
