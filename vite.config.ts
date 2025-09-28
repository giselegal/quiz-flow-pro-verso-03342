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
    strictPort: true, // Força usar exatamente a porta 8080
    fs: {
      allow: ['..'],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    // 🚀 Configuração SPA completa para desenvolvimento
    middlewareMode: false,
    proxy: {},
    // SPA routing será tratado pelo plugin vite
    hmr: {
      overlay: false, // Desabilitar overlay de erro para reduzir spam
      clientPort: 8080, // Usar porta específica
      port: 8080, // Porta do HMR
      // Otimizações para reduzir spam de websocket
      timeout: 30000, // Timeout para reconexão
      reconnectDelay: 1000, // Delay entre tentativas
      maxReconnectAttempts: 5, // Máximo de tentativas
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    // 🚀 Configuração para SPA no preview também
    strictPort: true,
  },
  publicDir: 'public',
  assetsInclude: ['**/*.json'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['wouter'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-accordion'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'wouter'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITEST': JSON.stringify(process.env.VITEST || false),
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
});
