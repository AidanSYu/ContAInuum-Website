/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

// Integration tests hit a LOCAL Supabase stack (`supabase start`) over HTTP and
// assert real DB/function behavior. They self-skip when the stack isn't
// reachable — see supabase/tests/README.md.
//
// Kept separate from vitest.config.ts so the fast unit suite (`npm test`) never
// depends on Docker/Supabase being up.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['supabase/tests/**/*.integration.test.ts'],
    // Edge Function cold starts + DB round-trips are slower than unit tests.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Tests share one database — run files serially to avoid interference.
    fileParallelism: false,
    pool: 'forks',
  },
});
