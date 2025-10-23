import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

// 🎯 CONFIGURAÇÃO CONSOLIDADA E OTIMIZADA (P1)
// Única configuração Vite do projeto (inline e original deprecados)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: '/',
    envPrefix: 'VITE_',
    plugins: [
      react({
        // Configuração explícita para evitar problemas com forwardRef
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        babel: {
          plugins: [],
        },
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
        // Garantir que React seja resolvido corretamente
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      // Vite padrão em dev é 5173. Mantemos 5173 para coexistir com o redirecionador 8080 -> 5173.
      port: 5173,
      open: false,
      cors: true,
      strictPort: true,
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
      hmr: {
        overlay: false,
        // HMR via porta do Vite (5173). O acesso legacy via 8080 é apenas um redirect HTTP.
        clientPort: 5173,
        port: 5173,
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
      rollupOptions: {
        // Evita problemas de ordem de inicialização em cenários com ciclos leves
        preserveEntrySignatures: 'exports-only',
        input: { main: path.resolve(__dirname, 'index.html') },
        external: [
          /^supabase\/functions\/.*/,
          /^https:\/\/deno\.land\/.*/,
          /^https:\/\/esm\.sh\/.*/
        ],
        output: {
          // 🚀 FASE 2.3 - Manual Chunks para otimização de bundle
          manualChunks: (id) => {
            // React core (sempre carregado)
            if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/wouter/')) {
              return 'vendor-react';
            }

            // UI libraries (Radix UI + Lucide)
            if (id.includes('@radix-ui') ||
              id.includes('lucide-react') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }

            // Supabase (lazy loaded quando necessário)
            if (id.includes('@supabase') || id.includes('supabase-js')) {
              return 'vendor-supabase';
            }

            // Charts library (apenas para analytics)
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }

            // Canonical services (sempre carregados, mas pequenos ~12KB)
            if (id.includes('/src/services/canonical/')) {
              return 'services-canonical';
            }

            // Editor (grande - 590KB, split em partes menores)
            // Editor Core - main editor file
            if (id.includes('QuizModularProductionEditor.tsx')) {
              return 'chunk-editor-core';
            }

            // Editor Components - auxiliary components
            if (id.includes('ModernUnifiedEditor') ||
              id.includes('/src/components/editor/quiz/components/') ||
              id.includes('DynamicPropertiesForm') ||
              id.includes('ThemeEditorPanel')) {
              return 'chunk-editor-components';
            }

            // Editor Renderers - preview renderers
            if (id.includes('/src/components/editor/renderers/') ||
              id.includes('QuizProductionPreview') ||
              id.includes('BlockTypeRenderer')) {
              return 'chunk-editor-renderers';
            }

            // Editor Hooks & Utils
            if (id.includes('/src/components/editor/quiz/hooks/') ||
              id.includes('useValidation') ||
              id.includes('usePanelWidths') ||
              id.includes('useEditorHistory')) {
              return 'chunk-editor-utils';
            }

            // Analytics/Participants (80KB, pode ser split também)
            if (id.includes('ParticipantsPage')) {
              return 'chunk-analytics-participants';
            }

            if (id.includes('EnhancedRealTimeDashboard') ||
              id.includes('RealDataAnalyticsService')) {
              return 'chunk-analytics-dashboard';
            }

            // Block Registry (604KB, split por categoria)
            // Registry Core
            if (id.includes('EnhancedBlockRegistry.tsx') ||
              id.includes('HybridBlockRegistry') ||
              id.includes('DynamicBlockRegistry')) {
              return 'chunk-blocks-registry';
            }

            // Blocks - Intro/Question (usados frequentemente)
            if (id.includes('/src/components/editor/blocks/atomic/Intro') ||
              id.includes('/src/components/editor/blocks/atomic/Question') ||
              id.includes('QuizIntroHeaderBlock') ||
              id.includes('OptionsGridBlock')) {
              return 'chunk-blocks-common';
            }

            // Blocks - Result (lazy load)
            if (id.includes('/src/components/editor/blocks/atomic/Result') ||
              id.includes('ResultHeaderBlock') ||
              id.includes('ResultCTABlock')) {
              return 'chunk-blocks-result';
            }

            // Blocks - Transition (lazy load)
            if (id.includes('/src/components/editor/blocks/atomic/Transition') ||
              id.includes('QuizTransitionBlock')) {
              return 'chunk-blocks-transition';
            }

            // Blocks - Offer/Sales (lazy load - apenas ofertas)
            if (id.includes('QuizOfferHeroBlock') ||
              id.includes('TestimonialsBlock') ||
              id.includes('BonusBlock') ||
              id.includes('GuaranteeBlock') ||
              id.includes('BenefitsListBlock') ||
              id.includes('ValueAnchoringBlock') ||
              id.includes('SecurePurchaseBlock')) {
              return 'chunk-blocks-offer';
            }

            // Blocks - Inline (text, button, image - comuns)
            if (id.includes('InlineBlock.tsx') ||
              id.includes('/src/components/editor/blocks/inline/')) {
              return 'chunk-blocks-inline';
            }

            // Blocks - Modular (Step20, etc)
            if (id.includes('Step20ModularBlocks') ||
              id.includes('ModularResultHeader')) {
              return 'chunk-blocks-modular';
            }

            // Templates (lazy loaded)
            if (id.includes('/src/templates/') ||
              id.includes('quiz21StepsComplete') ||
              id.includes('embedded.ts')) {
              return 'chunk-templates';
            }

            // Admin pages (lazy loaded apenas admin)
            if (id.includes('/src/pages/admin/')) {
              return 'chunk-admin';
            }

            // Quiz pages (lazy loaded quando necessário)
            if (id.includes('QuizIntegratedPage') ||
              id.includes('QuizEstiloPessoalPage') ||
              id.includes('QuizAIPage')) {
              return 'chunk-quiz';
            }
          }
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'wouter',
        'recharts',
      ],
      esbuildOptions: {
        target: 'es2020',
        loader: { '.js': 'jsx' },
      },
      force: false, // Não forçar rebuild em dev
    },
    define: {
      global: 'globalThis',
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
