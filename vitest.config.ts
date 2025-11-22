import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // Default para componentes React
    setupFiles: [
      './src/__tests__/test-setup.ts',
      './src/__tests__/setup/indexeddb.mock.ts',
      './src/__tests__/legacy-tests/setup/mockTemplatesApi.ts'
    ],
    css: true,
    // Garante que mocks e espioes sejam limpos entre testes para evitar retenção de memória
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    // Evita concorrência dentro do mesmo arquivo de teste e diminui pico de memória
    maxConcurrency: 1,
    // Reduz ruído de logs para evitar acumular memória no worker
    silent: true,
    onConsoleLog(log, type) {
      // Bloquear logs muito verbosos que poluem a saída e consomem memória
      const noisy = /AUTO-LOAD|UnifiedQuizStorage|Resultado carregado|Iniciando cálculo|Calculando perfil|Scores calculados|Gerando recomendações|Resultados salvos no Supabase|EditorProvider\.addBlock|Template carregado|Quiz theme|NOME CAPTURADO|Medições de performance|Performance\]/i;
      if (noisy.test(log)) return false;
    },
    // Usa processos (forks) para isolar memória e evitar OOM em worker_threads
    pool: 'forks',
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 3, // ⬆️ Aumentado de 1 para 3 (Sprint 4 Dia 3 - Otimização)
        // Aumenta limite de memória para worker
        execArgv: ['--max-old-space-size=8192'],
      },
    },
    // Timeout maior para testes que fazem carregamento pesado
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 15000,
    sequence: {
      concurrent: false,
    },
    // Configuração de projetos para diferentes ambientes (substitui environmentMatchGlobs)
    projects: [
      {
        // Projeto para testes Node (sem DOM) - mais rápido e com menos memória
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'src/utils/**/*.{test,spec}.{ts,tsx}',
            'src/services/**/*.{test,spec}.{ts,tsx}',
            'src/core/**/*.{test,spec}.{ts,tsx}',
            'src/consolidated/**/*.{test,spec}.{ts,tsx}',
            'src/optimization/**/*.{test,spec}.{ts,tsx}',
            'src/migration/**/*.{test,spec}.{ts,tsx}',
            'src/hooks/**/*.{test,spec}.ts', // Hooks sem JSX
          ],
        },
      },
      {
        // Projeto para testes de componentes React (precisa DOM)
        test: {
          name: 'react',
          environment: 'happy-dom',
          include: [
            'src/components/**/*.{test,spec}.{ts,tsx}',
            'src/pages/**/*.{test,spec}.{ts,tsx}',
            'src/contexts/**/*.{test,spec}.{ts,tsx}',
            'src/hooks/**/*.{test,spec}.tsx', // Hooks com JSX
            'src/testing/**/*.test.ts',
          ],
        },
      },
    ],
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      // Somente arquivos com sufixo .test/.spec dentro de __tests__
      'src/**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/testing/**/*.test.ts', // Nossos testes consolidados
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      // Evita rodar testes/copias dentro de worktrees que podem carregar um React duplicado
      'worktrees/**',
      '**/worktrees/**',
      // Ignora suites e2e/placeholders fora de src
      'tests/**',
      // Isola Playwright specs do Vitest
      'src/tests/e2e/**',
      // Ignora arquivos de setup utilitários sem suites
      // Ignora suites e2e/placeholders fora de src
      'tests/**',
      // Isola Playwright specs para não serem pegos pelo Vitest
      'src/tests/e2e/**',
      // Evita arquivos de setup/auxiliares sem suite serem coletados como testes
      'src/__tests__/setup/**',
      'src/__tests__/schemas/**',
      // Arquivo sem suite conhecido (pode ser reativado quando possuir testes)
      'src/core/errors/__tests__/FunnelErrorSystem.test.ts',
      'src/__tests__/setup/**',
      // Ignora coleções de schemas sem suite real
      'src/__tests__/schemas/**',
      // Ignora placeholders que ainda não possuem suites
      'src/core/errors/__tests__/**',
      // Ignora testes legacy quebrados
      'src/__tests__/legacy-tests/**/*.skip',
      'src/__tests__/legacy-tests/**/*SKIP*',
    ],
    coverage: {
      provider: 'v8', // Melhor performance
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/legacy/',
        'dist/',
        'build/',
        'src/testing/mocks.ts' // Exclude mock files
      ],
      // Thresholds para arquitetura consolidada
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80
        },
        './src/consolidated/**/*.ts': {
          statements: 85,
          branches: 75,
          functions: 85,
          lines: 85
        }
      },
    },
    // Reporters detalhados
    reporters: [
      'verbose',
      'html',
      'json'
    ],
    outputFile: {
      html: './coverage/test-report.html',
      json: './coverage/test-results.json'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@templates': path.resolve(__dirname, './src/templates'),
      '@consolidated': path.resolve(__dirname, './src/consolidated'),
      '@optimization': path.resolve(__dirname, './src/optimization'),
      '@migration': path.resolve(__dirname, './src/migration'),
      '@testing': path.resolve(__dirname, './src/testing')
    },
    // Garante resolução correta de extensões TypeScript
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
    // Garante uma única instância de React durante os testes
    dedupe: ['react', 'react-dom'],
  },
});
