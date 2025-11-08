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
      minify: isProd ? 'terser' : false, // ✅ SEM minify em DEV para debug
      terserOptions: isProd ? ({
        compress: {
          // 🛡️ EXTREMAMENTE conservador para evitar TDZ
          inline: 0, // ✅ NÃO fazer inline de funções
          reduce_funcs: false, // ✅ NÃO reduzir funções
          reduce_vars: false, // ✅ NÃO reduzir variáveis
          passes: 1, // ✅ Apenas 1 passe
          sequences: false, // ✅ NÃO combinar statements
          conditionals: false, // ✅ NÃO otimizar condicionais
          comparisons: false, // ✅ NÃO otimizar comparações
          evaluate: false, // ✅ NÃO avaliar expressões constantes
          booleans: false, // ✅ NÃO otimizar booleanos
          loops: false, // ✅ NÃO otimizar loops
          unused: false, // ✅ NÃO remover código não usado (pode quebrar side effects)
          hoist_funs: false, // ✅ NÃO mover funções para o topo
          hoist_vars: false, // ✅ NÃO mover vars para o topo
          if_return: false, // ✅ NÃO otimizar if/return
          join_vars: false, // ✅ NÃO juntar declarações de var
          side_effects: false, // ✅ NÃO remover expressões sem efeito aparente
          warnings: false,
          drop_console: true, // ✅ Remover apenas console (seguro)
        },
        mangle: {
          keep_fnames: true, // ✅ Preservar nomes de funções
          keep_classnames: true, // ✅ Preservar nomes de classes
        },
        format: {
          comments: false,
          beautify: false,
        },
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
          // Preservar efeitos de módulos externos (node_modules) para não reordenar inicializações internas
          moduleSideEffects: true,
          // Preservar possíveis side effects em leituras de propriedades
          propertyReadSideEffects: true,
          // Manter deotimização padrão em try/catch
          tryCatchDeoptimization: true,
        },
        output: {
          // Nomes de arquivos para chunks
          chunkFileNames: 'assets/[name]-[hash].js',
          // 🚀 CODE SPLITTING MAIS GRANULAR
          // Separação por domínios para reduzir o payload inicial e melhorar cache
          manualChunks: (id) => {
            // Evitar separar recharts em DEV para mitigar ReferenceError (TDZ) em chunk isolado
            const isDev = mode !== 'production';

            if (id.includes('node_modules')) {
              // SOLUÇÃO DEFINITIVA: NÃO separar React em chunks diferentes
              // React, ReactDOM, UI components (Radix) E DND-KIT vão TODOS para o MESMO chunk
              // Isto garante que React esteja disponível quando qualquer lib tentar usar React hooks
              if (id.includes('/react/') || id.includes('/react-dom/') || 
                  id.includes('/scheduler/') || id.includes('/react-is/') ||
                  id.includes('@radix-ui') || id.includes('lucide-react') ||
                  id.includes('@dnd-kit') ||
                  id.includes('class-variance-authority')) { // ✅ Incluir cva no vendor principal
                return 'vendor'; // TUDO no mesmo chunk - sem problemas de ordem
              }
              
              if (!isDev && id.includes('recharts')) return 'charts-vendor';
              
              // Outros node_modules vão para vendor genérico
              return 'vendor-misc';
            }

            if (id.includes('/src/components/editor/')) return 'editor';
            if (id.includes('/src/runtime/quiz')) return 'quiz-runtime';
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
        // Incluir APIs críticas que podem causar problemas se não pré-bundladas
        '@radix-ui/react-slot',
        '@radix-ui/react-portal',
        'lucide-react',
        // ✅ Incluir cva para evitar TDZ
        'class-variance-authority',
        // ✅ CRÍTICO: Incluir react-resizable-panels que usa forwardRef
        'react-resizable-panels',
      ],
      exclude: [
        '@supabase/functions-js',
        // Em produção podemos excluir 'recharts' para manter chunk separado; em dev deixamos esbuild pré-bundle
        ...(mode === 'production' ? ['recharts'] : []),
      ],
      esbuildOptions: {
        target: 'es2020',
        loader: { '.js': 'jsx', '.ts': 'tsx' },
      },
      // Forçar re-otimização para garantir que react-preload seja processado
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