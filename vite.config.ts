import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Garante caminhos absolutos corretos para rotas e recursos
  base: '/',
  plugins: [
    react(), 
    splitVendorChunkPlugin(),
  ],
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
    // 🚀 LIMITE AUMENTADO baseado na análise (era 500kB, agora 1MB)
    chunkSizeWarningLimit: 1000,
    // Copiar templates para o build
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // 📦 CHUNKING ESTRATÉGICO OTIMIZADO baseado na análise do bundle
        manualChunks: {
          // Vendor chunks separados (bibliotecas grandes)
          'react-vendor': ['react', 'react-dom'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'icons-vendor': ['lucide-react'],
          'charts-vendor': ['recharts'], // 410kB identificado no build
          'ui-vendor': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-select'],

          // 🎯 COMPONENTES PESADOS IDENTIFICADOS NO BUILD ANALYSIS
          'editor-heavy': [
            './src/components/editor/SchemaDrivenEditorResponsive', // 218kB
            './src/components/editor/EditorProvider', // 70kB
            './src/components/editor/properties/EnhancedPropertiesPanel' // 17kB
          ],
          
          'pages-admin': [
            './src/pages/admin/MetricsPage', // 20kB
            './src/pages/admin/ParticipantsPage', // 35kB
            './src/pages/admin/NoCodeConfigPage' // 63kB
          ],
          
          'pages-quiz': [
            './src/pages/QuizModularPage', // 30kB
            './src/pages/admin/OverviewPage' // 27kB
          ],

          // Sistemas modulares
          'funnel-system': [
            './src/core/funnel/FunnelCore',
            './src/core/funnel/FunnelEngine',
            './src/core/funnel/hooks/useFunnelState'
          ],
          'quiz-system': [
            './src/components/quiz/QuizRenderer',
            './src/services/quizResultsService',
            './src/hooks/useQuizFlow'
          ],
          
          // 📊 REGISTRY PESADO SEPARADO
          'registry-heavy': ['./src/components/editor/blocks/optimizedRegistry'] // 73kB
        },
        
        // 📁 ORGANIZAÇÃO MELHORADA DE ARQUIVOS
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Configurações para resolver problemas com módulos CommonJS
    commonjsOptions: {
      // Transformar módulos CommonJS para ESM
      transformMixedEsModules: true,
      // Adicionar shim para 'require' em ambiente ESM
      include: [/node_modules/],
    },
    
    // 🎯 OTIMIZAÇÕES ADICIONAIS
    target: 'esnext',
    minify: 'esbuild'
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
