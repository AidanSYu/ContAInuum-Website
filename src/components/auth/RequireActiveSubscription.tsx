import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMySubscription, hasAccess } from '@/lib/api/subscriptions';
import { Spinner } from '@/components/ui/spinner';

/**
 * Gate for subscription-only areas (currently projects). While the subscription
 * resolves we show a spinner; lapsed users are sent to /app/billing with an
 * info toast. Reuses the ['subscription'] query key so the cache is shared with
 * Overview/Billing/Projects (no extra fetch).
 */
export function RequireActiveSubscription() {
  const { data: sub, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: getMySubscription,
  });

  const access = hasAccess(sub ?? null);

  useEffect(() => {
    if (!isLoading && !access) {
      toast('You need an active subscription to access projects.');
    }
  }, [isLoading, access]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-6 w-6 text-safety" />
      </div>
    );
  }

  if (!access) {
    return <Navigate to="/app/billing" replace />;
  }

  return <Outlet />;
}
