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
        '@templates': path.resolve(__dirname, './src/templates'),
        // CRÍTICO: Garantir que React seja sempre resolvido do mesmo lugar
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
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
        // HMR habilitado via mesma porta do servidor
        clientPort: 8080,
        port: 8080,
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
      // 🎯 FASE 3 TASK 7: Otimizações de bundle
      minify: 'esbuild', // esbuild é mais rápido que terser
      target: 'es2020',
      sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
      // 🎯 FASE 6: Chunk size limits otimizados
      chunkSizeWarningLimit: 500, // Warning em 500 kB (antes era padrão 500)
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
        // 🎯 FASE 3 TASK 7: Tree shaking agressivo
        treeshake: {
          moduleSideEffects: 'no-external', // Remover side effects de node_modules
          propertyReadSideEffects: false, // Assumir que property reads não têm side effects
          tryCatchDeoptimization: false, // Não desotimizar try-catch
        },
        output: {
          // Nomes de arquivos para chunks
          chunkFileNames: 'assets/[name]-[hash].js',
          // 🚀 FASE 3.2: Code Splitting Agressivo Otimizado
          // Objetivo: app-blocks 502KB → ~150KB, app-editor 253KB → ~100KB
          manualChunks: (id) => {
            // ========== VENDOR CHUNKS ==========
            if (id.includes('node_modules')) {
              // React ecosystem
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              // UI libraries
              if (id.includes('@radix-ui') || id.includes('cmdk')) {
                return 'vendor-ui';
              }
              // Data/Charts (lazy load apenas em analytics)
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              // DnD
              if (id.includes('@dnd-kit')) {
                return 'vendor-dnd';
              }
              // Supabase
              if (id.includes('@supabase') || id.includes('postgrest-js')) {
                return 'vendor-supabase';
              }
              // Icons - separar lucide-react para tree shaking
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Outras libs pequenas
              return 'vendor-misc';
            }

            // ========== APPLICATION CHUNKS - FASE 3.2 ==========
            
            // 🎯 BLOCKS: Split por categoria (502KB → 5x100KB)
            if (id.includes('/blocks/')) {
              // Core blocks (sempre carregados) ~50KB
              if (id.includes('HeaderBlock') || 
                  id.includes('TextBlock') || 
                  id.includes('ImageBlock') || 
                  id.includes('ButtonBlock')) {
                return 'blocks-core';
              }
              
              // Intro blocks (lazy) ~80KB
              if (id.includes('IntroFormBlock') || 
                  id.includes('IntroLogoBlock') || 
                  id.includes('IntroTitleBlock') ||
                  id.includes('IntroImageBlock') ||
                  id.includes('IntroDescriptionBlock')) {
                return 'blocks-intro';
              }
              
              // Question blocks (lazy) ~100KB
              if (id.includes('QuestionProgressBlock') || 
                  id.includes('QuestionTextBlock') ||
                  id.includes('QuestionNumberBlock') ||
                  id.includes('QuestionNavigationBlock') ||
                  id.includes('QuestionInstructionsBlock') ||
                  id.includes('OptionsGridBlock')) {
                return 'blocks-question';
              }
              
              // Result blocks (lazy) ~90KB
              if (id.includes('ResultMainBlock') || 
                  id.includes('ResultImageBlock') ||
                  id.includes('ResultDescriptionBlock') ||
                  id.includes('ResultSecondaryStylesBlock') ||
                  id.includes('ResultShareBlock') ||
                  id.includes('ResultCTABlock')) {
                return 'blocks-result';
              }
              
              // Offer blocks (lazy) ~120KB
              if (id.includes('QuizOfferHeroBlock') || 
                  id.includes('ValueAnchoringBlock') ||
                  id.includes('TestimonialsBlock') ||
                  id.includes('BenefitsListBlock') ||
                  id.includes('SecurePurchaseBlock') ||
                  id.includes('GuaranteeBlock')) {
                return 'blocks-offer';
              }
              
              // Transition blocks (lazy) ~40KB
              if (id.includes('TransitionTitleBlock') ||
                  id.includes('TransitionTextBlock')) {
                return 'blocks-transition';
              }
              
              // Outros blocks
              return 'blocks-misc';
            }

            // 🎯 EDITOR: Split por arquivo específico (melhor granularidade)
            if (id.includes('/editor/')) {
              // Editor Core - rotas e layout básico (~20KB)
              if (id.includes('editor/index.tsx') || 
                  id.includes('EditorHeader') ||
                  id.includes('FunnelHeader')) {
                return 'editor-core';
              }
              
              // Editor Principal - FORÇAR para app-editor apenas arquivos principais
              // UniversalVisualEditor, ModernUnifiedEditor, QuizEditorIntegratedPage
              if (id.includes('UniversalVisualEditor') || 
                  id.includes('ModernUnifiedEditor') ||
                  id.includes('QuizEditorIntegratedPage')) {
                return 'app-editor';
              }
              
              // Editor Avançado - componentes DnD e properties (lazy ~150KB)
              // NOTA: Precisa ser checado ANTES de app-editor para interceptar
              if (id.includes('DragDropSystem') ||
                  id.includes('PropertiesPanel') ||
                  id.includes('ComponentsSidebar') ||
                  id.includes('DynamicPropertiesForm') ||
                  id.includes('BuilderSystemPanel') ||
                  id.includes('FieldControl') ||
                  id.includes('ConfigurationPanel')) {
                return 'editor-advanced';
              }
              
              // Fallback para outros componentes de editor
              return 'editor-misc';
            }

            // Preview/Runtime chunk
            if (id.includes('QuizProductionPreview') || 
                id.includes('QuizAppConnected') ||
                id.includes('UnifiedStepRenderer')) {
              return 'app-runtime';
            }

            // Analytics chunk (lazy)
            if (id.includes('ParticipantsPage') || 
                id.includes('AnalyticsPage') ||
                id.includes('FacebookMetricsPage')) {
              return 'app-analytics';
            }

            // Dashboard chunk (lazy)
            if (id.includes('Dashboard') && !id.includes('node_modules')) {
              return 'app-dashboard';
            }

            // Registry chunk
            if (id.includes('Registry') && !id.includes('/blocks/')) {
              return 'app-registry';
            }

            // Services chunk (~400KB → keep consolidado)
            if (id.includes('/services/') && !id.includes('node_modules')) {
              return 'app-services';
            }

            // 🎯 TEMPLATES: Smart lazy loading aplicado (310KB → 50KB inicial)
            // Templates agora são carregados sob demanda via TemplateService.lazyLoadStep()
            if (id.includes('/templates/') || id.includes('Template')) {
              return 'app-templates';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'react-is',
        'scheduler',
        'prop-types',
        'object-assign',
        'wouter',
      ],
      exclude: [
        // Excluir módulos que causam problemas de bundling
        '@supabase/functions-js',
      ],
      esbuildOptions: {
        target: 'es2020',
        loader: { '.js': 'jsx' },
      },
      // Forçar re-otimização para garantir dependências corretas
      force: true,
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
