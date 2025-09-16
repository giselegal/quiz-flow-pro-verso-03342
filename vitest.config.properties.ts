/**
 * 🧪 CONFIGURAÇÃO DO VITEST PARA TESTES DAS PROPRIEDADES
 */

/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        globals: true,
        css: true,
        include: [
            'src/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
        exclude: [
            'node_modules/**',
            'dist/**',
            '.next/**',
            'coverage/**'
        ],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.{js,ts}',
                '**/types.ts'
            ],
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80
                }
            }
        },
        // Configurações específicas para testes de propriedades
        testTimeout: 10000,
        hookTimeout: 10000,
        // Configurações de performance
        maxConcurrency: 5,
        isolate: true,
        // Mock de módulos específicos
        deps: {
            // Força rebuilding de dependências em modo de desenvolvimento
            inline: [
                '@testing-library/react',
                '@testing-library/jest-dom',
                '@testing-library/user-event'
            ]
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/types': resolve(__dirname, './src/types'),
            '@/utils': resolve(__dirname, './src/utils'),
            '@/context': resolve(__dirname, './src/context'),
            '@/test': resolve(__dirname, './src/test')
        }
    },
    define: {
        // Definições globais para os testes
        'process.env.NODE_ENV': '"test"',
        'process.env.VITE_SUPABASE_URL': '"mock-supabase-url"',
        'process.env.VITE_SUPABASE_ANON_KEY': '"mock-anon-key"'
    }
});