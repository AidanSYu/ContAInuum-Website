// Edge Function: contact
// Validates + Turnstile-verifies a contact submission, stores it with the
// service_role key (bypassing RLS), and optionally emails a notification.
//
// Deploy:  supabase functions deploy contact
// Secrets: SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY are auto-injected.
//          Optionally set TURNSTILE_SECRET_KEY, RESEND_API_KEY,
//          CONTACT_NOTIFY_EMAIL, EMAIL_FROM.

import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  clientIp,
  corsHeaders,
  isValidEmail,
  json,
  sha256,
  verifyTurnstile,
} from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, req);

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ error: 'Invalid body' }, 400, req);

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const organization = String(body.organization ?? '').trim();
    const message = String(body.message ?? '').trim();
    const topic = String(body.topic ?? '').trim().slice(0, 50);
    const honeypot = String(body.company_website ?? '');
    const token = String(body.turnstileToken ?? '');

    // Bot caught by honeypot — pretend success, store nothing.
    if (honeypot) return json({ ok: true }, 200, req);

    // Server-side validation (mirrors the client Zod schema).
    if (!name || name.length > 200) return json({ error: 'Invalid name' }, 400, req);
    if (!isValidEmail(email)) return json({ error: 'Invalid email' }, 400, req);
    if (organization.length > 200) return json({ error: 'Organization is too long' }, 400, req);
    if (!message || message.length > 5000) return json({ error: 'Invalid message' }, 400, req);

    const ip = clientIp(req);
    if (!(await verifyTurnstile(token, ip))) {
      return json({ error: 'Verification failed. Please try again.' }, 400, req);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      organization: organization || null,
      message,
      ip_hash: ip ? await sha256(ip) : null,
      topic: topic || null,
    });

    if (error) {
      console.error('insert contact_messages failed:', error);
      return json({ error: 'Could not save your message.' }, 500, req);
    }

    // Best-effort email notification (no-op unless Resend is configured).
    await notify({ name, email, organization, message, topic }).catch((e) =>
      console.error('notify failed:', e),
    );

    return json({ ok: true }, 200, req);
  } catch (e) {
    console.error('contact function error:', e);
    return json({ error: 'Unexpected error' }, 500, req);
  }
});

/** Human label for a topic key, used in the notification subject for triage. */
function topicLabel(topic: string): string {
  switch (topic) {
    case 'partner': return 'Design-partner application';
    case 'pilot': return 'Pilot request';
    case 'enterprise': return 'Institute / enterprise inquiry';
    case 'demo': return 'Demo request';
    case 'security': return 'Security inquiry';
    default: return 'Contact';
  }
}

async function notify(msg: {
  name: string;
  email: string;
  organization: string;
  message: string;
  topic: string;
}): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const to = Deno.env.get('CONTACT_NOTIFY_EMAIL');
  const from = Deno.env.get('EMAIL_FROM');
  if (!apiKey || !to || !from) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: msg.email,
      subject: `${topicLabel(msg.topic)}: ${msg.name}${msg.organization ? ` (${msg.organization})` : ''}`,
      text: `Topic: ${msg.topic || 'general'}\nFrom: ${msg.name} <${msg.email}>\nOrg: ${msg.organization || '—'}\n\n${msg.message}`,
    }),
  });
}
