import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      // Fonte canônica de templates e shims
      'src/tests/templates/canonicalSource.test.ts',
      // Testes focados no layer canônico (façade + subservices)
      'src/__tests__/canonical-**/*.test.ts',
      'src/__tests__/canonical-*.test.ts',
      'src/__tests__/data/**/*.test.ts',
      'src/__tests__/monitoring/**/*.test.ts'
    ],
    reporters: ['default'],
    silent: true,
    maxConcurrency: 1,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    coverage: {
      reporter: ['text'],
      reportsDirectory: './coverage/canonical'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@templates': path.resolve(__dirname, './src/templates')
    }
  }
});
