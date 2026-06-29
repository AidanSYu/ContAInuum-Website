import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui/spinner';

/**
 * Gate for authenticated areas. While the initial session resolves we show a
 * spinner; unauthenticated users are sent to /login with a `from` so we can
 * bounce them back after they sign in.
 */
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner className="h-6 w-6 text-safety" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Defense in depth: even if a session exists, refuse to render the app for an
  // unconfirmed email. A normally-confirmed user (incl. Supabase auto-confirm)
  // carries one of these timestamps and passes straight through.
  if (!user.email_confirmed_at && !user.confirmed_at) {
    toast.error('Please confirm your email to continue');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
