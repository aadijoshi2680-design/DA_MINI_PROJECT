import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-framework': ['react', 'react-dom', 'react-router-dom', 'zustand', 'framer-motion'],
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
