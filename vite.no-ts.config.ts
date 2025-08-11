import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Configuração que ignora completamente TypeScript checking
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
        presets: [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    loader: 'tsx',
    include: /\.(tsx?|jsx?)$/,
    exclude: [],
    target: 'es2020',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});