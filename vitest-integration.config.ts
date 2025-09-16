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
    
    // Integration test specific configuration
    include: [
      'src/test/**/*.test.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}', // Exclude unit tests
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}', // Exclude unit tests
      'src/tests/**/*.{test,spec}.{js,ts,jsx,tsx}', // Exclude legacy tests
    ],
    
    // Performance optimizations for integration tests
    testTimeout: 60000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    
    // Use threads for better isolation
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 2,
      },
    },
    
    // Reduced concurrency for stability
    maxConcurrency: 2,
    
    // Coverage configuration
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/tests/',
        '**/*.d.ts',
        'src/legacy/',
        'dist/',
        'build/',
      ],
      reportsDirectory: './coverage-integration',
    },
    
    // Reporter configuration
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-results-integration.json',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
});