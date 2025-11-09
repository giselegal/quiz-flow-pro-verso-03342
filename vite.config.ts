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
          // Manter defaults do Vite/Rollup e apenas nomear chunks
          chunkFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
    optimizeDeps: {
      // Voltar ao comportamento padrão, minimizando interferência
      force: false,
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
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