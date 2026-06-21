import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client. Sensible defaults: short stale window, single
 * retry on reads, no retry on writes (so failed mutations surface immediately).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
