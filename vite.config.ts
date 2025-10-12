import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// Import do vitest/config para tipagem do bloco `test`
import { defineConfig } from 'vitest/config';
// Nota: Se o tipo 'test' gerar erro de tipo, garantir que 'vitest' está instalado
// e que 'types' inclui 'vitest' em tsconfig. Caso contrário remover bloco.

// Configuração consolidada e sanitizada (UTF-8, sem duplicações) + suporte a testes
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // Bundle analyzer - gera stats.html após build
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // 'treemap' | 'sunburst' | 'network'
    }) as any,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    cors: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Evita reescrever caminhos adicionais: mantém /api/... intacto
        // Opcional: timeout/ping de WS futuramente
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
    // CSS Optimization
    cssMinify: 'lightningcss', // Minificador CSS ultra-rápido (mais eficiente que esbuild)
    cssCodeSplit: true, // Separar CSS por chunk para lazy loading
    rollupOptions: {
      input: { main: path.resolve(__dirname, 'index.html') },
      external: [
        /^supabase\/functions\/.*/,
        /^https:\/\/deno\.land\/.*/,
        /^https:\/\/esm\.sh\/.*/
      ],
      output: {
        // Manual chunks para otimizar bundle splitting
        manualChunks: (id) => {
          // Vendor chunks - bibliotecas principais separadas
          if (id.includes('node_modules')) {
            // React core - usado em todas as páginas
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('wouter')) {
              return 'vendor-react';
            }

            // Recharts - biblioteca de charts muito pesada (400KB)
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }

            // Supabase - cliente de banco de dados
            if (id.includes('@supabase') || id.includes('supabase-js')) {
              return 'vendor-supabase';
            }

            // Radix UI - componentes de UI
            if (id.includes('@radix-ui')) {
              return 'vendor-ui-radix';
            }

            // Lucide - ícones
            if (id.includes('lucide-react')) {
              return 'vendor-ui-icons';
            }

            // Outras bibliotecas UI
            if (id.includes('framer-motion') || id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-ui-utils';
            }

            // Restante das dependências
            return 'vendor-other';
          }

          // Feature-based chunks - código próprio
          // Editor (grande, usado apenas em /editor)
          if (id.includes('/src/components/editor/') || id.includes('/src/editor/')) {
            return 'feature-editor';
          }

          // Quiz (usado em páginas específicas)
          if (id.includes('/src/components/quiz/') || id.includes('/src/quiz/')) {
            return 'feature-quiz';
          }

          // Dashboard/Admin (usado apenas em admin)
          if (id.includes('/src/pages/dashboard/') || id.includes('/src/components/dashboard/')) {
            return 'feature-dashboard';
          }

          // Templates (usado em várias páginas)
          if (id.includes('/src/templates/')) {
            return 'feature-templates';
          }

          // Services - pode ser grande
          if (id.includes('/src/services/')) {
            return 'feature-services';
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
      'react-router-dom',
    ],
    exclude: ['recharts'],
    esbuildOptions: {
      target: 'es2020',
      loader: { '.js': 'jsx' },
    },
  },
  define: { global: 'globalThis' },
  esbuild: { target: 'es2020' },
  // Configuração de testes Vitest
  // Bloco de testes Vitest (comenta se types não presentes)
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup/vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
});
