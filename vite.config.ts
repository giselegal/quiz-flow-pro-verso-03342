import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Configuração OTIMIZADA para funcionar com Lovable
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
    cors: true,
    strictPort: true,
    fs: {
      allow: [
        '..',
        '../..',
        process.cwd(),
        path.resolve(process.cwd(), '..'),
        path.resolve(process.cwd(), '../..'),
        path.resolve(__dirname),
        __dirname,
      ],
      deny: [],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    middlewareMode: false,
    proxy: {},
    hmr: {
      overlay: false,
      clientPort: 8080,
      port: 8080,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    cors: true,
    strictPort: true,
  },
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
    include: ['react', 'react-dom'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  define: {
    global: 'globalThis',
  },
  esbuild: {
    target: 'es2020',
  },
});
