import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

// 🎯 CONFIGURAÇÃO CONSOLIDADA E OTIMIZADA (P1)
// Única configuração Vite do projeto (inline e original deprecados)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isStaging = mode === 'staging';
  const isProd = mode === 'production';
  const preferredPort = Number(env.VITE_PORT || process.env.VITE_PORT || 8080);

  return {
    base: '/',
    envPrefix: 'VITE_',
    // 🔧 FIX: Forçar modo ESM para evitar problemas com CommonJS
    mode: mode,
    plugins: [
      react({
        // 🔧 FIX: Configuração aprimorada para resolver problemas de módulo React
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        babel: {
          plugins: [],
          // Preservar order de importações
          parserOpts: {
            plugins: ['jsx', 'typescript'],
          },
          compact: false, // Não compactar - ajuda debug
          retainLines: mode !== 'production', // Manter linhas em dev
        },
        // Garantir que React seja sempre incluído
        include: /\.(jsx|tsx|js|ts)$/,
        exclude: /node_modules\/(?!(@radix-ui|lucide-react))/,
      }),
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }) as any,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@templates': path.resolve(__dirname, './src/templates'),
        // 🔧 FIX: Garantir que React seja sempre resolvido do mesmo lugar
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime'),
        'react/jsx-dev-runtime': path.resolve(__dirname, './node_modules/react/jsx-dev-runtime'),
  // Removido alias manual de 'tslib' para deixar Vite resolver corretamente
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
      // 🔧 FIX: Extensões de arquivo explícitas
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
      host: '0.0.0.0',
      port: preferredPort,
      open: false,
      cors: true,
      // Se a porta preferida estiver ocupada, permitir fallback automático
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      },
      fs: {
        allow: [path.resolve(__dirname), path.resolve(__dirname, '..'), process.cwd()],
        deny: ['**/supabase/functions/**'],
      },
      headers: {
        // 🔧 OTIMIZADO PARA VS CODE SIMPLE BROWSER
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma',
        'Access-Control-Allow-Credentials': 'true',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        // Garantir que o Simple Browser funcione
        'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' ws: wss: http: https:",
      },
      // HMR otimizado para ambientes containerizados
      hmr: {
        overlay: true,
        timeout: 10000,
        // Garantir que funcione no VS Code
        port: preferredPort + 1000, // Usar porta separada para HMR
        host: 'localhost',
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      cors: true,
      strictPort: true,
    },
    publicDir: 'public',
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
    build: {
      outDir: 'dist',
      cssMinify: 'lightningcss',
      cssCodeSplit: true,
      target: 'es2020',
      // 🚀 FASE 2: Minificação otimizada
      minify: isProd ? 'terser' : false,
      // 🔧 Terser com configurações balanceadas
      terserOptions: isProd ? ({
        compress: {
          inline: 2,
          reduce_funcs: true,
          reduce_vars: true,
          passes: 2,
          drop_console: true,
          drop_debugger: true,
          hoist_funs: false, // Evitar TDZ
          hoist_vars: false,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          keep_fnames: true,
          keep_classnames: true,
        },
        format: { comments: false },
      } as any) : undefined,
      // Sourcemaps apenas em staging
      sourcemap: isStaging ? true : false,
      // 🎯 FASE 2: Chunk size warning em 1MB (aumentado de 500kb)
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      rollupOptions: {
        onwarn(warning, warn) {
          // Suprimir warnings específicos que não são críticos
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          if (warning.code === 'SOURCEMAP_ERROR') return;
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        },
        // CRÍTICO: Força todos os exports a serem preservados de forma mais permissiva
        preserveEntrySignatures: 'allow-extension',
        input: { main: path.resolve(__dirname, 'index.html') },
        external: [
          /^supabase\/functions\/.*/,
          /^https:\/\/deno\.land\/.*/,
          /^https:\/\/esm\.sh\/.*/
        ],
        // ⚠️ Treeshake mais conservador para evitar quebras em vendors (ex.: recharts)
        treeshake: {
          // Mais agressivo para código próprio; manter efeitos em node_modules especificados caso necessário
          moduleSideEffects: (id) => /node_modules\/(recharts|@sentry|lucide-react)/.test(id),
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
        output: {
          // Manter defaults do Vite/Rollup e apenas nomear chunks
          chunkFileNames: 'assets/[name]-[hash].js',
          // 🚀 FASE 2: Estratégia otimizada de code splitting
          // Separação inteligente de chunks para melhor performance e cache
          manualChunks(id) {
            // 🔧 FIX: Resolução específica de warnings de chunks mistos
            
            // Supabase: forçar chunk único para evitar import misto
            if (id.includes('node_modules/@supabase/supabase-js') ||
                id.includes('/services/integrations/supabase/')) return 'supabase';
            
            // Templates: agrupar templates relacionados em chunk único
            if (id.includes('/templates/quiz21StepsComplete.ts') || 
                id.includes('/templates/registry.ts') ||
                id.includes('/templates/quiz21StepsSimplified.ts')) return 'templates-core';
            
            // Block registry: agrupar componentes de bloco 
            if (id.includes('/components/editor/blocks/TextInlineBlock.tsx') ||
                id.includes('/components/editor/blocks/FormInputBlock.tsx') ||
                id.includes('/core/registry/UnifiedBlockRegistry.ts')) return 'editor-blocks';
            
            // Services: agrupar services que se importam mutuamente
            if (id.includes('/services/canonical/TemplateService.ts') ||
                id.includes('/services/core/ConsolidatedTemplateService.ts') ||
                id.includes('/services/core/HierarchicalTemplateSource.ts') ||
                id.includes('/lib/utils/templateDiagnostic.ts')) return 'services-core';
                
            // Utils compartilhados
            if (id.includes('/lib/utils/notify.ts') ||
                id.includes('/contexts/data/StepsContext.tsx')) return 'utils-shared';

            // ===== VENDORS EXTERNOS =====
            // A11y (carregamento sob demanda)
            if (id.includes('node_modules/axe-core')) return 'a11y';
            if (id.includes('node_modules/@axe-core/react')) return 'a11y-react';
            
            // Cache lib
            if (id.includes('node_modules/lru-cache')) return 'cache-lib';
            
            // Lodash (tree-shakeable)
            if (id.includes('node_modules/lodash')) return 'lodash';

            // Radix UI (UI components - cacheável)
            if (id.includes('node_modules/@radix-ui')) return 'radix-ui';
            
            // Lucide icons (cacheável, usado em múltiplas páginas)
            if (id.includes('node_modules/lucide-react')) return 'icons';

            // Wouter (router - crítico mas pequeno)
            if (id.includes('node_modules/wouter')) return 'router';
            
            // Form libs (react-hook-form + zod)
            if (id.includes('node_modules/react-hook-form') || 
                id.includes('node_modules/@hookform') ||
                id.includes('node_modules/zod')) return 'forms';

            // ===== EDITOR ESPECÍFICO =====
            // DND Kit (editor drag-and-drop)
            if (id.includes('node_modules/@dnd-kit')) return 'editor-dnd';
            
            // Craft.js (editor visual)
            if (id.includes('node_modules/craftjs') || id.includes('node_modules/@craftjs')) return 'editor-craft';

            // ===== ANALYTICS (lazy) =====
            if (id.includes('node_modules/recharts')) return 'analytics-charts';
            if (id.includes('/src/components/analytics/')) return 'analytics-components';

            // ===== CÓDIGO INTERNO =====
            // Logging system (ferramentas de debug)
            if (id.includes('/src/lib/utils/logging/')) return 'logger-core';
            
            // Admin routes (lazy loading)
            if (id.includes('/src/pages/admin/') || 
                id.includes('/src/components/admin/')) return 'admin';

            // ===== REACT CORE =====
            // React e ReactDOM juntos para evitar duplicação
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom')) return 'react-vendor';

            // Fallback: split automático do Vite
          },
        },
      },
    },
    optimizeDeps: {
      // Voltar ao comportamento padrão, minimizando interferência
      force: false,
      // Pré-bundle de libs grandes usadas no primeiro render para reduzir transformação fria (DEV)
      include: [
        'react', 'react-dom', 'react/jsx-runtime', 'react-dom/client',
        'wouter', 'react-helmet-async', 'zod', 'tslib',
        '@radix-ui/react-dialog', '@radix-ui/react-toast', '@radix-ui/react-popover', '@radix-ui/react-dropdown-menu'
      ],
      esbuildOptions: {
        target: 'es2020',
        keepNames: true,
        // 🔧 FIX: Injetar TypeScript helpers completos
        banner: {
          js: `
// TypeScript Runtime Helpers
if (typeof globalThis.__assign !== 'function') {
  globalThis.__assign = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
}

if (typeof globalThis.__rest !== 'function') {
  globalThis.__rest = function (source, excluded) {
    var target = {};
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key) && excluded.indexOf(key) < 0) {
        target[key] = source[key];
      }
    }
    return target;
  };
}

if (typeof globalThis.__spreadArray !== 'function') {
  globalThis.__spreadArray = function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
}
`
        }
      },
    },
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY),
      'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(env.VITE_SUPABASE_PROJECT_ID),
    },
    esbuild: { target: 'es2020' },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['tests/setup/vitest.setup.ts'],
      clearMocks: true,
      restoreMocks: true,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',

        // Testes legados incompatíveis com arquitetura atual
        'src/__tests__/PropertiesPanel.comprehensive.test.tsx',
        'src/__tests__/PropertiesPanel.integration.test.tsx',
        'src/__tests__/PropertiesPanel.visual.test.tsx',
        'src/adapters/__tests__/QuizStepAdapter.test.ts',
      ],
    },
  };
});