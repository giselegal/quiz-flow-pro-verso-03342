import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/tests/templates/canonicalSource.test.ts'
    ],
    reporters: ['default'],
    silent: true,
    maxConcurrency: 1,
    coverage: {
      reporter: ['text'],
      reportsDirectory: './coverage/canonical'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
