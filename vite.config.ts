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
                  id.includes('ButtonBlock') ||
                  id.includes('BlockRenderer') ||
                  id.includes('BlockRegistry')) {
                return 'blocks-core';
              }
              
              // 🚀 FASE 3B.3: Intro blocks (lazy, step 1) ~80KB
              if (id.includes('IntroFormBlock') || 
                  id.includes('IntroLogoBlock') || 
                  id.includes('IntroTitleBlock') ||
                  id.includes('IntroImageBlock') ||
                  id.includes('IntroDescriptionBlock') ||
                  id.includes('IntroLogoHeaderBlock') ||
                  id.includes('/atomic/Intro')) {
                return 'blocks-intro';
              }
              
              // Question blocks (lazy, steps 2-11) ~100KB
              if (id.includes('QuestionProgressBlock') || 
                  id.includes('QuestionTextBlock') ||
                  id.includes('QuestionNumberBlock') ||
                  id.includes('QuestionNavigationBlock') ||
                  id.includes('QuestionInstructionsBlock') ||
                  id.includes('OptionsGridBlock') ||
                  id.includes('QuizNavigationBlock') ||
                  id.includes('QuizProgressBlock') ||
                  id.includes('QuizBackButtonBlock') ||
                  id.includes('/atomic/Question')) {
                return 'blocks-question';
              }
              
              // Result blocks (lazy, step 20) ~90KB
              if (id.includes('ResultMainBlock') || 
                  id.includes('ResultImageBlock') ||
                  id.includes('ResultDescriptionBlock') ||
                  id.includes('ResultSecondaryStylesBlock') ||
                  id.includes('ResultShareBlock') ||
                  id.includes('ResultCTABlock') ||
                  id.includes('ResultHeaderBlock') ||
                  id.includes('ResultCharacteristicsBlock') ||
                  id.includes('ResultStyleBlock') ||
                  id.includes('ResultProgressBarsBlock') ||
                  id.includes('ResultHeaderInlineBlock') ||
                  id.includes('ResultCongratsBlock') ||
                  id.includes('ResultCalculatedBlock') ||
                  id.includes('/atomic/Result') ||
                  id.includes('/result/')) {
                return 'blocks-result';
              }
              
              // Offer blocks (lazy, step 21) ~120KB
              if (id.includes('QuizOfferHeroBlock') || 
                  id.includes('ValueAnchoringBlock') ||
                  id.includes('TestimonialsBlock') ||
                  id.includes('BenefitsListBlock') ||
                  id.includes('BenefitsBlock') ||
                  id.includes('SecurePurchaseBlock') ||
                  id.includes('GuaranteeBlock') ||
                  id.includes('PricingSectionBlock') ||
                  id.includes('PricingInlineBlock') ||
                  id.includes('FAQSectionBlock') ||
                  id.includes('CountdownTimerBlock') ||
                  id.includes('UrgencyTimerInlineBlock') ||
                  id.includes('LegalNoticeBlock') ||
                  id.includes('SocialProofBlock') ||
                  id.includes('TestimonialsCarouselInlineBlock') ||
                  id.includes('MentorSectionInlineBlock') ||
                  id.includes('BeforeAfterInlineBlock') ||
                  id.includes('/offer/')) {
                return 'blocks-offer';
              }
              
              // Transition blocks (lazy, steps 12, 19) ~40KB
              if (id.includes('TransitionTitleBlock') ||
                  id.includes('TransitionTextBlock') ||
                  id.includes('TransitionMessageBlock') ||
                  id.includes('TransitionHeroBlock') ||
                  id.includes('TransitionLoaderBlock') ||
                  id.includes('TransitionProgressBlock') ||
                  id.includes('TransitionDescriptionBlock') ||
                  id.includes('QuizTransitionLoaderBlock') ||
                  id.includes('LoadingTransitionBlock') ||
                  id.includes('/atomic/Transition')) {
                return 'blocks-transition';
              }
              
              // Form blocks (lazy, usado em intro/offer) ~60KB
              if (id.includes('FormInputBlock') ||
                  id.includes('FormContainerBlock') ||
                  id.includes('LeadFormBlock') ||
                  id.includes('ConnectedLeadFormBlock') ||
                  id.includes('SimpleFormContainerBlock')) {
                return 'blocks-form';
              }
              
              // Inline/Simple blocks (lazy, variados) ~50KB
              if (id.includes('/inline/') ||
                  id.includes('/simple/') ||
                  id.includes('InlineBlock') ||
                  id.includes('CTAInlineBlock') ||
                  id.includes('BadgeInlineBlock') ||
                  id.includes('StatInlineBlock') ||
                  id.includes('ProgressInlineBlock') ||
                  id.includes('DecorativeBarBlock')) {
                return 'blocks-inline';
              }
              
              // Wrapper/Container blocks (core utility) ~30KB
              if (id.includes('BlockWrapper') ||
                  id.includes('SortableBlock') ||
                  id.includes('EditableBlock') ||
                  id.includes('PreviewBlock') ||
                  id.includes('SelectableBlock') ||
                  id.includes('UnifiedBlockWrappers') ||
                  id.includes('UniversalBlockRenderer') ||
                  id.includes('BlockSkeleton') ||
                  id.includes('OptimizedBlockRenderer') ||
                  id.includes('BasicContainerBlock')) {
                return 'blocks-core';
              }
              
              // Editor-specific blocks (lazy quando não em editor) ~40KB
              if (id.includes('/editor/blocks/') ||
                  id.includes('EditorOptionsGridBlock') ||
                  id.includes('EditorBlockItem') ||
                  id.includes('BlockPropertiesIntegration') ||
                  id.includes('EditBlockContent') ||
                  id.includes('AddBlockButton') ||
                  id.includes('DeleteBlockButton') ||
                  id.includes('DuplicateBlockDialog') ||
                  id.includes('BlockRow') ||
                  id.includes('BlockValidator') ||
                  id.includes('BlockPropertyPanel')) {
                return 'editor-components';
              }
              
              // AI/Advanced blocks (lazy, uso esporádico) ~30KB
              if (id.includes('/ai/') ||
                  id.includes('FashionAIGeneratorBlock') ||
                  id.includes('StyleCardsGridBlock') ||
                  id.includes('StyleCardBlock')) {
                return 'blocks-ai';
              }
              
              // Quiz-specific blocks (lazy) ~40KB  
              if (id.includes('QuizIntroBlock') ||
                  id.includes('QuizResultsBlock') ||
                  id.includes('QuizBenefitsBlock') ||
                  id.includes('QuizMultipleChoiceBlock') ||
                  id.includes('StrategicQuestionBlock') ||
                  id.includes('QuizTransitionBlock') ||
                  id.includes('StartButtonBlock')) {
                return 'blocks-quiz';
              }
              
              // Outros blocks (fallback)
              return 'blocks-misc';
            }

            // 🎯 EDITOR: Split detalhado (381KB → múltiplos chunks específicos)
            if (id.includes('/editor/') || id.includes('/pages/editor/')) {
              // 🚀 FASE 3B.1: Detectar lazy components PRIMEIRO
              
              // Painel de Propriedades (lazy ~70KB)
              if (id.includes('EditorPropertiesPanel') || 
                  id.includes('/editor/components/EditorPropertiesPanel')) {
                return 'editor-advanced';
              }
              
              // Componentes DnD e advanced (lazy ~100KB)
              if (id.includes('DragDropSystem') ||
                  id.includes('ComponentsSidebar') ||
                  id.includes('DynamicPropertiesForm') ||
                  id.includes('BuilderSystemPanel') ||
                  id.includes('FieldControl') ||
                  id.includes('ConfigurationPanel') ||
                  id.includes('/editor/dnd/')) {
                return 'editor-advanced';
              }
              
              // Canvas components (lazy quando não em editor) ~40KB
              if (id.includes('/editor/canvas/') ||
                  id.includes('CanvasDropZone') ||
                  id.includes('SortableBlockWrapper') ||
                  id.includes('EmptyCanvasInterface')) {
                return 'editor-canvas';
              }
              
              // Editor Providers e Contexts (core, sempre carregado) ~60KB
              if (id.includes('EditorProvider') ||
                  id.includes('EditorContext') ||
                  id.includes('EditorCompositeProvider') ||
                  id.includes('EditorRuntimeProviders') ||
                  id.includes('/contexts/editor/')) {
                return 'editor-core';
              }
              
              // Editor Services (lazy) ~40KB
              if (id.includes('/services/editor/') ||
                  id.includes('HistoryService') ||
                  id.includes('TemplateLoader') ||
                  id.includes('EditorStateManager')) {
                return 'services-editor';
              }
              
              // Editor Hooks (lazy quando não em uso) ~30KB
              if (id.includes('/editor/hooks/') ||
                  id.includes('/quiz/hooks/') ||
                  id.includes('useValidation') ||
                  id.includes('usePanelWidths') ||
                  id.includes('useEditorHistory') ||
                  id.includes('useStepsBlocks')) {
                return 'editor-hooks';
              }
              
              // Editor Modules (lazy) ~30KB
              if (id.includes('/editor/modules/') ||
                  id.includes('ModularResultHeader') ||
                  id.includes('LayoutShell')) {
                return 'editor-modules';
              }
              
              // Headers e navegação (~10KB)
              if (id.includes('EditorHeader') ||
                  id.includes('FunnelHeader') ||
                  id.includes('editor/index.tsx')) {
                return 'editor-core';
              }
              
              // Páginas principais do editor (NÃO lazy)
              if (id.includes('UniversalVisualEditor.tsx') || 
                  id.includes('ModernUnifiedEditor.tsx') ||
                  id.includes('QuizEditorIntegratedPage.tsx') ||
                  id.includes('QuizModularProductionEditor')) {
                return 'app-editor';
              }
              
              // Componentes helper do editor (Canvas, Toolbar, etc)
              if (id.includes('/editor/components/') ||
                  id.includes('/editor/helpers/')) {
                return 'editor-components';
              }
              
              // Tipos e utils do editor
              if (id.includes('/editor/types') ||
                  id.includes('/editor/utils')) {
                return 'editor-core';
              }
              
              // Fallback: outros arquivos de editor
              console.warn(`⚠️ Editor file não categorizado: ${id}`);
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

            // 🚀 FASE 3B.2: Services split por domínio (387KB → 3x ~120KB lazy)
            if (id.includes('/services/') && !id.includes('node_modules')) {
              // Template services (lazy quando não em uso)
              if (id.includes('/services/templates/') ||
                  id.includes('TemplateService') ||
                  id.includes('TemplateRegistry') ||
                  id.includes('stepTemplateService') ||
                  id.includes('MasterTemplateService')) {
                return 'services-template';
              }
              
              // Funnel services (lazy quando não em uso)
              if (id.includes('/services/funnel') ||
                  id.includes('FunnelService') ||
                  id.includes('FunnelValidation') ||
                  id.includes('FunnelAIAgent') ||
                  id.includes('FunnelTypesRegistry')) {
                return 'services-funnel';
              }
              
              // Data & Analytics services (lazy)
              if (id.includes('/services/canonical/data/') ||
                  id.includes('AnalyticsService') ||
                  id.includes('DataService') ||
                  id.includes('ResultDataService') ||
                  id.includes('ParticipantDataService') ||
                  id.includes('realTimeAnalytics')) {
                return 'services-data';
              }
              
              // Editor services (lazy quando não em editor)
              if (id.includes('/services/editor/') ||
                  id.includes('EditorService') ||
                  id.includes('QuizEditorBridge') ||
                  id.includes('PropertyExtraction')) {
                return 'services-editor';
              }
              
              // Performance & Monitoring (lazy)
              if (id.includes('/services/performance/') ||
                  id.includes('/services/monitoring/') ||
                  id.includes('performanceOptimizer') ||
                  id.includes('ErrorTracking') ||
                  id.includes('HealthCheck')) {
                return 'services-monitoring';
              }
              
              // Core services (sempre carregados)
              if (id.includes('/services/core/') ||
                  id.includes('/services/canonical/CacheService') ||
                  id.includes('/services/canonical/NavigationService') ||
                  id.includes('UnifiedCacheService') ||
                  id.includes('StorageService')) {
                return 'services-core';
              }
              
              // Outros services
              return 'services-misc';
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
