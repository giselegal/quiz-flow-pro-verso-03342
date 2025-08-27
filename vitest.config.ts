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
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'src/**/__tests__/**/*.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      // Evita rodar testes/copias dentro de worktrees que podem carregar um React duplicado
      'worktrees/**',
      '**/worktrees/**',
      // Ignora suites e2e/placeholders fora de src
      'tests/**',
      'src/tests/**',
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
