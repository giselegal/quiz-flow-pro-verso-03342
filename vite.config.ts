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
        output: {
          // Nomes de arquivos para chunks
          chunkFileNames: 'assets/[name]-[hash].js',
          // 🎯 SOLUÇÃO DEFINITIVA: Desabilitar code splitting manual problemático
          // Deixar Vite otimizar automaticamente baseado em imports dinâmicos
          manualChunks: undefined,
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
