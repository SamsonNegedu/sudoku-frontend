import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses including LAN
    port: 5173,
    allowedHosts: true, // Allow all hosts (including localtunnel domains)
  },
  build: {
    // Production optimizations
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/themes', '@radix-ui/react-icons'],
          store: ['zustand'],
        },
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Increase chunk size warning limit for better performance
    chunkSizeWarningLimit: 1000,
  },
  // Define global constants for production
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
