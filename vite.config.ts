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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
      // Não fixar porta do HMR; deixar sincronizar com a porta efetiva do servidor
      hmr: {
        overlay: true, // ✅ FASE 3: Mostrar overlay de erros
        timeout: 5000, // ✅ FASE 3: Timeout maior para evitar "closed without opened"
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
      // ⚠️ CORREÇÃO TDZ: Usar esbuild em DEV (mais rápido) e terser CONSERVADOR em PROD
      // Terser com configurações conservadoras para evitar "Cannot access 'X' before initialization"
      minify: isProd ? 'terser' : false, // ✅ Sem minify em DEV
      // 🔧 Otimização moderada: reduz tamanho mantendo segurança contra TDZ comuns
      terserOptions: isProd ? ({
        compress: {
          inline: 2,            // permitir alguma inlining segura
          reduce_funcs: true,   // reduzir funções inline simples
          reduce_vars: true,    // reduzir vars simples
          passes: 2,            // duas passagens para melhor compressão
          drop_console: true,   // remover console.*
          drop_debugger: true,  // remover debugger
          hoist_funs: false,    // manter para evitar edge-cases
          hoist_vars: false,
          // manter side_effects default (true) mas proteger libs sensíveis via moduleSideEffects
        },
        mangle: {
          keep_fnames: true,      // preservar nomes (debug + SSR safety)
          keep_classnames: true,
        },
        format: { comments: false },
      } as any) : undefined,
      target: 'es2020',
      // 🧹 FASE 1: Remove console.* in production builds
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // Ativar sourcemaps somente em staging para facilitar diagnóstico (React #418, vendor chunks)
      sourcemap: isStaging ? true : false,
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
        },
      },
    },
    optimizeDeps: {
      // Voltar ao comportamento padrão, minimizando interferência
      force: false,
      // Pré-bundle de libs grandes usadas no primeiro render para reduzir transformação fria (DEV)
      include: [
        'react', 'react-dom', 'react/jsx-runtime', 'react-dom/client',
        'wouter', 'react-helmet-async', 'zod',
        '@radix-ui/react-dialog', '@radix-ui/react-toast', '@radix-ui/react-popover', '@radix-ui/react-dropdown-menu'
      ],
      esbuildOptions: {
        target: 'es2020',
        keepNames: true,
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