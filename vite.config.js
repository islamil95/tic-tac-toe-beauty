import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Vite Proxy] Переадресация запроса:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[Vite Proxy] Ответ от сервера:', proxyRes.statusCode);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy] Ошибка прокси:', err.message);
          });
        },
      }
    }
  }
})

