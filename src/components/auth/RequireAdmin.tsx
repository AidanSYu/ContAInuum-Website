import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/lib/api/profiles';
import { Spinner } from '@/components/ui/spinner';

/**
 * Gate for admin-only areas (the escrow console). Reuses the ['profile'] query
 * key so the role lookup is shared with DashboardLayout / SettingsPage (no extra
 * fetch). Non-admins are silently redirected to /app. This is UI-convenience
 * defense only — real authorization is is_admin() in RLS + the escrow-admin edge
 * function's is_admin gate. Nests inside RequireAuth, so a session is guaranteed.
 */
export function RequireAdmin() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyProfile,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-safety" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
