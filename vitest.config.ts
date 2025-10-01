import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // default para testes de UI
    projects: [
      // UI / DOM-focused tests
      {
        test: {
          environment: 'happy-dom',
          include: [
            'src/components/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/pages/**/*.{test,spec}.{js,ts,jsx,tsx}'
          ]
        }
      },
      // Node environment for domain/core logic
      {
        test: {
          environment: 'node',
          include: [
            'src/utils/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/services/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/core/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/consolidated/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/optimization/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/migration/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'src/domain/**/*.{test,spec}.{js,ts,jsx,tsx}'
          ]
        }
      }
    ],
    setupFiles: ['./src/test/setup.ts'],
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
        maxForks: 1,
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
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}',
      'src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/testing/**/*.test.ts'
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
      '@consolidated': path.resolve(__dirname, './src/consolidated'),
      '@optimization': path.resolve(__dirname, './src/optimization'),
      '@migration': path.resolve(__dirname, './src/migration'),
      '@testing': path.resolve(__dirname, './src/testing')
    },
    dedupe: ['react', 'react-dom'],
  },
});
