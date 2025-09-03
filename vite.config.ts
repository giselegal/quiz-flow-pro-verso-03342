import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Garante caminhos absolutos corretos para rotas e recursos
  base: '/',
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
      // Em ambientes de preview (ex.: lovable.app) alguns servidores retornam 404/HTML para chunks dinâmicos,
      // causando "Failed to fetch dynamically imported module". Para garantir robustez, inlinamos imports dinâmicos
      // e desativamos code-splitting neste build padrão.
      output: {
        inlineDynamicImports: true,
        manualChunks: {
          'editor-core': ['./src/legacy/editor/EditorPro'],
          'canvas-components': ['./src/components/editor/canvas/CanvasDropZone.simple'],
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable'],
        }
      },
    },
    // Configurações para resolver problemas com módulos CommonJS
    commonjsOptions: {
      // Transformar módulos CommonJS para ESM
      transformMixedEsModules: true,
      // Adicionar shim para 'require' em ambiente ESM
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'wouter'],
    esbuildOptions: {
      // Necessário para resolver problemas com módulos CommonJS em ambiente ESM
      define: {
        global: 'globalThis',
      },
    },
  },
  // Configurações de performance adicionais
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    // Define process.env variables for client-side code
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITEST': JSON.stringify(process.env.VITEST || false),
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
