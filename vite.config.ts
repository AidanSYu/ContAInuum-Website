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
  // NOTE: a hand-rolled `manualChunks` vendor split used to live here. It split
  // React / Radix / vendor into separate chunks whose initialization order
  // formed a cycle, producing a production-only "Cannot access 'X' before
  // initialization" crash (white screen) while dev (unbundled ESM) looked fine.
  // Rollup's automatic chunking orders cyclic modules correctly, so we let it
  // decide. Routes are still code-split via React.lazy(), so first paint stays
  // small without the fragile manual split.
});
