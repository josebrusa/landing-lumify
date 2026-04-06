import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    cssMinify: 'esbuild',
  },
  // Si el backend no expone CORS al origen de Vite, puedes usar proxy en dev:
  // p. ej. VITE_API_BASE_URL=/api y descomentar server.proxy.
  // server: {
  //   proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') } },
  // },
})
