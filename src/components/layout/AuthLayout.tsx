import { Outlet } from 'react-router-dom';
import { GrainOverlay } from '@/components/effects';
import { Logo } from './Logo';

/** Centered shell for auth pages (login, signup, password reset). */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-void px-6 py-12">
      <GrainOverlay />
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #FF4D2E 0%, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="text-2xl" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
