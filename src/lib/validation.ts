import { z } from 'zod';
import type { Json } from './database.types';

/** Recursive JSON value schema, matches the `Json` type of jsonb columns. */
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema),
  ]),
);

/**
 * Shared validation schemas. The SAME rules run client-side (instant feedback)
 * and are mirrored server-side in the Edge Functions, never trust the client.
 */

// Provider-agnostic email check (avoids relying on a specific Zod version's
// .email() API and works whether the value is trimmed/lowercased upstream).
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Enter a valid email')
  .max(320, 'Email is too long')
  .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), 'Enter a valid email');

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  email: emailField,
  organization: z.string().trim().max(200, 'Organization is too long').optional(),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long (5000 char max)'),
  /** Which funnel the message came from (partner, pilot, demo, …), for triage. */
  topic: z.string().trim().max(50).optional(),
  /** Honeypot: real users never fill this; bots often do. Must stay empty. */
  company_website: z.string().max(0).optional(),
  /** Cloudflare Turnstile token, attached at submit time. */
  turnstileToken: z.string().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({
  email: emailField,
  source: z.string().max(100).optional(),
  company_website: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
  data: jsonSchema.default({}),
});
export type ProjectInput = z.infer<typeof projectSchema>;

// ── Auth ────────────────────────────────────────────────────────────────────
const passwordField = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Password is too long'); // bcrypt 72-byte limit

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, 'Name is required').max(200, 'Name is too long'),
  email: emailField,
  password: passwordField,
});
export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({ email: emailField });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
