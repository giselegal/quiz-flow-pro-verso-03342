import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

const resolvePath = (dir: string) => fileURLToPath(new URL(dir, import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    visualizer({
      filename: '.security/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      '@components': resolvePath('./src/components'),
      '@services': resolvePath('./src/services'),
      '@hooks': resolvePath('./src/hooks'),
      '@utils': resolvePath('./src/utils'),
      '@lib': resolvePath('./src/lib'),
      '@types': resolvePath('./src/types'),
      '@config': resolvePath('./src/config'),
      '@templates': resolvePath('./src/templates'),
    },
    // ✅ Priorizar exports ESM sobre CommonJS (Windows compatibility)
    conditions: ['import', 'module', 'browser', 'default'],
  },
  build: {
    // ✅ OTIMIZAÇÃO: Code splitting agressivo
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendors principais
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('jsx-runtime')) {
              return 'vendor-react';
            }
            if (id.includes('wouter') || id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Acessibilidade lazy (579 KB) - carregar apenas quando necessário
            if (id.includes('axe-core')) {
              return 'vendor-axe';
            }
            // Drag-and-drop
            if (id.includes('sortable') || id.includes('dnd-kit')) {
              return 'vendor-dnd';
            }
            // Outros vendors
            return 'vendor-misc';
          }

          // 🎯 CODE SPLITTING POR DOMÍNIO DE APLICAÇÃO

          // Editor (300-400 KB)
          if (id.includes('/src/pages/editor/') ||
            id.includes('/src/components/editor/') ||
            id.includes('EditorContext') ||
            id.includes('EditorService')) {
            return 'app-editor';
          }

          // Quiz Runtime (200-300 KB)
          if (id.includes('/src/pages/quiz/') ||
            id.includes('/src/components/quiz/') ||
            id.includes('QuizContext') ||
            id.includes('quizDataService')) {
            return 'app-quiz';
          }

          // Admin/Dashboard (200-300 KB)
          if (id.includes('/src/pages/admin/') ||
            id.includes('/src/components/admin/') ||
            id.includes('AdminLayout') ||
            id.includes('Dashboard')) {
            return 'app-admin';
          }

          // Serviços Canônicos (consolidados)
          if (id.includes('/src/services/canonical/')) {
            return 'services-canonical';
          }

          // Templates e Schemas
          if (id.includes('/src/config/schemas/') ||
            id.includes('/src/templates/')) {
            return 'templates-config';
          }
        },
      },
    },
    // ✅ Otimizações gerais
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Warning para chunks > 500KB
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // ✅ OTIMIZAÇÃO: Pre-bundling de deps comuns
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'dompurify',
    ],
  },
})
