// Arquivado em 2025-09-03: root padronizado para vite.config.ts.
// Mantido apenas para referência histórica.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                main: '/index.html'
            }
        }
    }
});
