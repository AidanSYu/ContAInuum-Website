import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendors into separate, independently-cacheable chunks so
        // the first paint no longer downloads one giant bundle.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('/react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          )
            return 'react-vendor';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('recharts') || id.includes('/d3-') || id.includes('/victory-')) return 'charts';
          if (id.includes('@stripe')) return 'stripe';
          return 'vendor';
        },
      },
    },
  },
});
