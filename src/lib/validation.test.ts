import { describe, it, expect } from 'vitest';
import {
  contactSchema,
  subscribeSchema,
  projectSchema,
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './validation';

describe('email normalization (emailField)', () => {
  it('trims and lowercases a valid address', () => {
    const r = loginSchema.safeParse({ email: '  User@Example.COM  ', password: 'x' });
    expect(r.success).toBe(true);
    expect(r.success && r.data.email).toBe('user@example.com');
  });

  it('rejects addresses without a domain or @', () => {
    for (const email of ['nope', 'a@b', 'a@b.', '@b.com', 'a b@c.com']) {
      expect(forgotPasswordSchema.safeParse({ email }).success).toBe(false);
    }
  });

  it('rejects an empty / too-short email', () => {
    expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
  });

  it('rejects an over-long email (> 320 chars)', () => {
    const huge = `${'a'.repeat(315)}@b.com`; // > 320 after the domain
    expect(forgotPasswordSchema.safeParse({ email: huge }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a normal credential pair', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret' }).success).toBe(true);
  });

  it('requires a non-empty password', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(r.success).toBe(false);
    expect(!r.success && r.error.issues[0].message).toBe('Password is required');
  });
});

describe('signupSchema', () => {
  const base = { fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'longenough' };

  it('accepts a complete signup', () => {
    expect(signupSchema.safeParse(base).success).toBe(true);
  });

  it('requires a full name', () => {
    expect(signupSchema.safeParse({ ...base, fullName: '   ' }).success).toBe(false);
  });

  it('enforces an 8-char minimum password', () => {
    expect(signupSchema.safeParse({ ...base, password: '1234567' }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: '12345678' }).success).toBe(true);
  });

  it('enforces the 72-byte bcrypt ceiling', () => {
    expect(signupSchema.safeParse({ ...base, password: 'a'.repeat(72) }).success).toBe(true);
    expect(signupSchema.safeParse({ ...base, password: 'a'.repeat(73) }).success).toBe(false);
  });
});

describe('contactSchema', () => {
  const base = { name: 'Grace', email: 'grace@example.com', message: 'Hello there.' };

  it('accepts a valid message with the honeypot empty', () => {
    expect(contactSchema.safeParse({ ...base, company_website: '' }).success).toBe(true);
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a filled honeypot (bot trap)', () => {
    expect(contactSchema.safeParse({ ...base, company_website: 'http://spam.example' }).success).toBe(false);
  });

  it('requires name and message', () => {
    expect(contactSchema.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: '   ' }).success).toBe(false);
  });

  it('caps message length at 5000 chars', () => {
    expect(contactSchema.safeParse({ ...base, message: 'a'.repeat(5000) }).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, message: 'a'.repeat(5001) }).success).toBe(false);
  });
});

describe('subscribeSchema', () => {
  it('accepts an email and rejects a filled honeypot', () => {
    expect(subscribeSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
    expect(subscribeSchema.safeParse({ email: 'a@b.com', company_website: 'x' }).success).toBe(false);
  });
});

describe('projectSchema', () => {
  it('requires a title and defaults data to {}', () => {
    const r = projectSchema.safeParse({ title: 'My project' });
    expect(r.success).toBe(true);
    expect(r.success && r.data.data).toEqual({});
  });

  it('rejects an empty title', () => {
    expect(projectSchema.safeParse({ title: '' }).success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('passes when both passwords match', () => {
    expect(resetPasswordSchema.safeParse({ password: 'longenough', confirm: 'longenough' }).success).toBe(true);
  });

  it('fails (on the confirm field) when they differ', () => {
    const r = resetPasswordSchema.safeParse({ password: 'longenough', confirm: 'different1' });
    expect(r.success).toBe(false);
    expect(!r.success && r.error.issues[0].path).toEqual(['confirm']);
  });
});
