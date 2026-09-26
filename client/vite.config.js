import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
