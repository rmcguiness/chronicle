/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import type { ResolvedConfig } from 'vite'

// https://vite.dev/config/
//
// `--mode demo` (npm run dev:demo / build:demo / preview:demo) turns on the static,
// read-only demo: VITE_DEMO_MODE is forced to "true" so src/api/client.ts reads
// public/demo/snapshot.json instead of calling the backend. A VITE_DEMO_MODE=true
// environment variable works too, in any mode.
let outDir = 'dist'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      // Normal builds talk to the API, so don't ship the ~600 KB demo snapshot with them.
      name: 'chronicle-strip-demo-snapshot',
      apply: 'build',
      configResolved(config: ResolvedConfig) {
        outDir = resolve(config.root, config.build.outDir)
      },
      closeBundle() {
        if (mode !== 'demo' && process.env.VITE_DEMO_MODE !== 'true') {
          rmSync(resolve(outDir, 'demo'), { recursive: true, force: true })
        }
      },
    },
  ],
  define:
    mode === 'demo' ? { 'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true') } : {},
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],

          'xyflow': ['@xyflow/react'],
          'query': ['@tanstack/react-query'],
          'zustand': ['zustand'],
          'motion': ['framer-motion'],
        },
      },
    },
  },
}))
