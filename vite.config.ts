import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Garante caminhos relativos corretos em ambientes hospedados (chunks dinâmicos)
  base: './',
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Evita múltiplas instâncias de React em pastas duplicadas (ex.: worktrees)
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    // Configurações para resolver problemas de CORS no Codespaces
    cors: {
      origin: [
        'http://localhost:8080',
        'https://lovable.dev',
        'https://api.lovable.dev',
        'https://lovable-api.com',
        /^https:\/\/.*\.lovable\.app$/,
        /^https:\/\/.*\.lovable\.dev$/,
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    strictPort: false,
    // Middleware para servir templates da pasta /templates
    middlewareMode: false,
    fs: {
      // Restringe acessos a pastas necessárias do projeto, evitando worktrees/externas
      allow: ['templates', 'public', 'src'],
    },
    // Ignora watchers em cópias/espelhos (worktrees, examples, assets colados)
    watch: {
      ignored: ['**/worktrees/**', '**/examples/**', '**/attached_assets/**'],
    },
    // Headers para resolver problemas de autenticação
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  // Configuração para servir templates como assets estáticos
  publicDir: 'public',
  assetsInclude: ['**/*.json'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // Copiar templates para o build
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Manter React e React-DOM juntos para evitar problemas de createContext
          'react-vendor': ['react', 'react-dom'],
          // Router separado
          'router-vendor': ['wouter'],
          // UI libraries
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
          // Form libraries
          'forms-vendor': ['react-hook-form', 'zod'],
          // Animation
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'wouter'],
  },
  // Configurações de performance adicionais
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
