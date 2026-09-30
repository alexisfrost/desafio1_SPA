import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In development, requests to /api/* are proxied to the backend so the
// browser doesn't hit CORS issues. /api/login -> BACKEND_URL/api/login
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const backend = env.BACKEND_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
        },
      },
    },
  };
});
