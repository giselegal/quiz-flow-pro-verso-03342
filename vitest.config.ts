import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

// Vitest 3+: migração para test.projects, substituindo environmentMatchGlobs
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Configuração base compartilhada entre os projetos
    setupFiles: [
      './src/test/setup.ts',
      './src/__tests__/setup/indexeddb.mock.ts',
      './src/tests/setup/mockTemplatesApi.ts'
    ],
    css: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    maxConcurrency: 1,
    silent: true,
    onConsoleLog(log) {
      const noisy = /AUTO-LOAD|UnifiedQuizStorage|Resultado carregado|Iniciando cálculo|Calculando perfil|Scores calculados|Gerando recomendações|Resultados salvos no Supabase|EditorProvider\.addBlock|Template carregado|Quiz theme|NOME CAPTURADO|Medições de performance|Performance\]/i;
      if (noisy.test(log)) return false;
    },
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 15000,
    sequence: { concurrent: false },
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}',
      'src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/testing/**/*.test.ts',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'worktrees/**',
      '**/worktrees/**',
      'tests/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/legacy/',
        'dist/',
        'build/',
        'src/testing/mocks.ts'
      ],
      thresholds: {
        global: { statements: 80, branches: 70, functions: 80, lines: 80 },
        './src/consolidated/**/*.ts': { statements: 85, branches: 75, functions: 85, lines: 85 }
      },
    },
    reporters: ['verbose', 'html', 'json'],
    outputFile: {
      html: './coverage/test-report.html',
      json: './coverage/test-results.json'
    },
    // Segmentação por projetos: DOM (happy-dom) e Node (node)
    projects: [
      {
        test: {
          environment: 'happy-dom',
          setupFiles: [
            './src/test/setup.ts',
            './src/__tests__/setup/indexeddb.mock.ts',
            './src/tests/setup/mockTemplatesApi.ts'
          ],
          include: [
            'src/components/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/pages/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/routes/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/components/**/__tests__/**/*.{js,ts,jsx,tsx}',
          ],
          // Isolar memória para suites com DOM
          pool: 'forks',
          poolOptions: {
            forks: { isolate: true, singleFork: false }
          },
        }
      },
      {
        test: {
          environment: 'node',
          // Setup leve e compatível com Node
          setupFiles: [
            './tests/setup/vitest.setup.ts',
          ],
          include: [
            'src/utils/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/services/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/core/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/consolidated/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/optimization/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/migration/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/config/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/testing/**/*.test.ts',
          ],
          exclude: [
            'src/components/**',
            'src/pages/**',
            'src/routes/**',
          ],
          // Threads suficientes e singleThread para previsibilidade
          pool: 'threads',
          poolOptions: {
            threads: { singleThread: true }
          },
        }
      }
    ],
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
    dedupe: ['react', 'react-dom'],
  },
});
