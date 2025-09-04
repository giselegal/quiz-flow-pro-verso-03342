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
    chunkSizeWarningLimit: 500,
    // Copiar templates para o build
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // Configuração otimizada para chunks menores e melhor cache
        manualChunks: (id) => {
          // Vendor chunks para melhor cache
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('recharts') || id.includes('chart')) {
              return 'charts-vendor';
            }
            return 'vendor';
          }

          // Pages chunks para lazy loading
          if (id.includes('/pages/MetricsPage')) {
            return 'metrics-page';
          }
          if (id.includes('/pages/SchemaEditorPage')) {
            return 'schema-page';
          }
          if (id.includes('/legacy/editor/EditorPro')) {
            return 'editor-pro';
          }
          if (id.includes('/components/editor/canvas/')) {
            return 'canvas-components';
          }
          if (id.includes('/components/editor/properties/')) {
            return 'properties-components';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
