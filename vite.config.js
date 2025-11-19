import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
  },
  server: {
    port: 3000,
    proxy: {
      '/smrd': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
});
