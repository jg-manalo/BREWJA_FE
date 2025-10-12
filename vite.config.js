import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    allowedHosts: ['3e0c10f5045b.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
  } 
})
