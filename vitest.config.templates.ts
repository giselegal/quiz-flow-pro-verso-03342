import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: [
            'src/tests/templates/**/*.test.ts'
        ],
        reporters: ['basic'],
        silent: false,
        maxConcurrency: 1,
        coverage: {
            reporter: ['text', 'json'],
            reportsDirectory: './coverage/templates'
        }
    }
});
