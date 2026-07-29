import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Boldstone-256/',
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
