import { Outlet } from 'react-router-dom';
import { GrainOverlay, BlueprintGrid } from '@/components/effects';
import { Logo } from './Logo';

/** Centered shell for auth pages (login, signup, password reset). */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-6 py-12 text-ink">
      <GrainOverlay />
      <BlueprintGrid />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Logo className="text-2xl" />
          <span className="lab-label">SECURE ACCESS / ATLAS</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
