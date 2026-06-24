/// <reference types="vitest/config" />
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Self-contained test config (deliberately does NOT reuse vite.config's
// kimi inspect plugin, which would rewrite JSX during component tests).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    restoreMocks: true,
  },
});
