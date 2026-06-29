import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True until the initial session has been resolved. */
  loading: boolean;
  signInWithPassword: (
    email: string,
    password: string,
    captchaToken?: string,
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    captchaToken?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  /** Send a password-reset email with a link back to /reset-password. */
  requestPasswordReset: (email: string, captchaToken?: string) => Promise<void>;
  /** Set a new password (called from the reset-password recovery session). */
  updatePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
