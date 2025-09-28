import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  define: {
    // Suppress TypeScript errors in development
    __DEV__: mode === 'development',
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    allowedHosts: true,
    hmr: {
      port: 8080,
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lovable-tagger'],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Aumentar limite para 1MB
    rollupOptions: {
      output: {
        manualChunks: id => {
          // 📦 CHUNKING SUPER OTIMIZADO V2

          // React Core (separar react e react-dom)
          if (id.includes('react-dom')) {
            return 'react-dom';
          }
          if (id.includes('react/') && !id.includes('react-dom')) {
            return 'react-core';
          }

          // UI Libraries (dividir em sub-chunks menores)
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          if (id.includes('framer-motion')) {
            return 'animations';
          }

          // Editor - dividir em chunks MUITO menores
          if (id.includes('SchemaDrivenEditorResponsive')) {
            return 'editor-main';
          }
          if (id.includes('UniversalBlockRenderer')) {
            return 'block-renderer';
          }
          if (id.includes('DynamicPropertiesPanel')) {
            return 'properties-panel';
          }

          // Blocks - dividir por categoria específica
          if (id.includes('blocks/inline/Quiz') || id.includes('QuizInlineBlock')) {
            return 'blocks-quiz-inline';
          }
          if (id.includes('blocks/inline/') && !id.includes('Quiz')) {
            return 'blocks-inline-basic';
          }
          if (
            id.includes('blocks/') &&
            (id.includes('quiz') || id.includes('Quiz')) &&
            !id.includes('inline')
          ) {
            return 'blocks-quiz-main';
          }
          if (
            id.includes('blocks/') &&
            !id.includes('UniversalBlockRenderer') &&
            !id.includes('inline')
          ) {
            return 'blocks-basic';
          }

          // Editor Components - chunking específico
          if (id.includes('editor/sidebar/')) {
            return 'editor-sidebar';
          }
          if (id.includes('editor/canvas/')) {
            return 'editor-canvas';
          }
          if (id.includes('editor/toolbar/')) {
            return 'editor-toolbar';
          }
          if (id.includes('editor/preview/')) {
            return 'editor-preview';
          }

          // Config & Definitions
          if (id.includes('blockDefinitions')) {
            return 'block-definitions';
          }
          if (id.includes('stepTemplateService') || id.includes('steps/')) {
            return 'step-templates';
          }

          // Services - chunking mais granular
          if (id.includes('services/') && id.includes('supabase')) {
            return 'services-supabase';
          }
          if (id.includes('services/') && id.includes('funnel')) {
            return 'services-funnel';
          }
          if (id.includes('services/')) {
            return 'services-core';
          }

          // Hooks
          if (id.includes('hooks/') && id.includes('editor')) {
            return 'hooks-editor';
          }
          if (id.includes('hooks/')) {
            return 'hooks-core';
          }

          // Types & Utils
          if (id.includes('types/')) {
            return 'types';
          }
          if (id.includes('utils/')) {
            return 'utils';
          }

          // Contexts
          if (id.includes('context/') || id.includes('contexts/')) {
            return 'contexts';
          }

          // Pages - lazy loading já implementado
          if (id.includes('pages/admin/')) {
            return 'pages-admin';
          }
          if (id.includes('pages/')) {
            return 'pages-main';
          }

          // Third-party libraries - chunking mais específico
          if (id.includes('node_modules')) {
            // Database
            if (id.includes('supabase') || id.includes('postgres')) {
              return 'database';
            }
            // Text Editor
            if (id.includes('quill') || id.includes('react-quill')) {
              return 'text-editor';
            }
            // Routing
            if (id.includes('wouter') || id.includes('router')) {
              return 'routing';
            }
            // Form & Validation
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms';
            }
            // Drag & Drop
            if (id.includes('dnd') || id.includes('sortable')) {
              return 'drag-drop';
            }
            // Charts & Visualization
            if (id.includes('chart') || id.includes('recharts')) {
              return 'charts';
            }
            // Utilities
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('clsx')) {
              return 'utilities';
            }
            // Fallback para outras libraries
            return 'vendor';
          }
        },
        // Configurações adicionais para otimização
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        // Maximizar cache efficiency
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Configurações adicionais de build
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Remover sourcemaps em produção para reduzir tamanho
    cssCodeSplit: true, // Dividir CSS em chunks separados
    assetsInlineLimit: 4096, // Inline assets menores que 4KB
  },
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
      'direct-eval': 'silent',
    },
    target: 'es2020',
    tsconfigRaw: `{
      "compilerOptions": {
        "noImplicitAny": false,
        "strict": false,
        "skipLibCheck": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false
      }
    }`,
  },
}));
