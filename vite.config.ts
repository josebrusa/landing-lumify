import { fileURLToPath, URL } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite inlines `import.meta.env.VITE_*` at build time. If Netlify builds without
 * VITE_API_BASE_URL, the client falls back to same-origin `/api` → 404 on static hosting.
 */
function netlifyRequireViteApiBaseUrl(): Plugin {
  return {
    name: 'netlify-require-vite-api-base-url',
    configResolved(config) {
      if (config.command !== 'build') return
      if (process.env.NETLIFY !== 'true') return
      const v = process.env.VITE_API_BASE_URL?.trim()
      if (!v) {
        throw new Error(
          'Netlify build: missing VITE_API_BASE_URL. Site configuration → Environment variables: add VITE_API_BASE_URL (same name, VITE_ prefix required), enable it for Builds / Production / Deploy previews, then redeploy.',
        )
      }
    },
  }
}

const dockerDev = process.env.CHOKIDAR_USEPOLLING === 'true'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [netlifyRequireViteApiBaseUrl(), vue(), tailwindcss()],
  build: {
    cssMinify: 'esbuild',
  },
  server: dockerDev
    ? {
        host: '0.0.0.0',
        port: 5173,
        watch: { usePolling: true },
      }
    : undefined,
  preview: dockerDev
    ? {
        host: '0.0.0.0',
        port: 4173,
      }
    : undefined,
})
