import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: 'microsoft-edge',
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
