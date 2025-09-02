import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Reduz ruído de logs para evitar acumular memória no worker
    silent: true,
    onConsoleLog(log, type) {
      // Bloquear logs muito verbosos que poluem a saída e consomem memória
      const noisy = /AUTO-LOAD|UnifiedQuizStorage|Resultado carregado|Iniciando cálculo|Calculando perfil|Scores calculados|Gerando recomendações|Resultados salvos no Supabase|EditorProvider\.addBlock|Template carregado|Quiz theme|NOME CAPTURADO|Medições de performance|Performance\]/i;
      if (noisy.test(log)) return false;
    },
    // Reduz threads para evitar OOM em ambientes com pouca memória
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1,
      },
    },
    sequence: {
      concurrent: false,
    },
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}',
      'src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
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
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', 'src/legacy/', 'dist/', 'build/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Garante uma única instância de React durante os testes
    dedupe: ['react', 'react-dom'],
  },
});
